//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.DataAccess.RDBMS;
using Collect.DataAccess.TSDB;
using Collect.Models;
using Collect.Service.ODBC.Query;
using NLog;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.Linq;

namespace Collect.Wrapper.ODBC
{
    public class CollectOdbcDeviceWrapper : ICollectServiceDeviceWrapper
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        public static string Tsdb;
        public static string UserName;
        public static string Password;
        public ICollectServiceDevice DeviceModel { get; set; }
        private readonly CollectTsdb tsdb = new CollectTsdb(UserName,Password,Tsdb);
       
        public DateTime PollTime { get; set; }
        public DateTime HistoricalPollTime { get; set; }

        public CollectOdbcDeviceWrapper(ICollectServiceDevice DeviceModel)
        {
            this.DeviceModel = DeviceModel;
            List<CollectTagModel> pluginModelList = new CollectTagRepository().GetTagModelList(DeviceModel.DeviceId);

            foreach (var item in pluginModelList)
            {
                CollectOdbcTag odbcTagModel = new CollectOdbcTag()
                {
                    TagId = item.TagId,
                    TagName = item.TagName,
                    Device = DeviceModel,
                    TagIdValue = item.Details.GetValue("OdbcTagId")
                };
                logger.Debug("===============================");
                logger.Debug($"\n CollectOdbcTag TagID= {odbcTagModel.TagId}\n TagName= {odbcTagModel.TagName}\n ");
                logger.Debug("===============================");
                DeviceModel.Tags.Add(odbcTagModel as ICollectServiceTag);
            }
        }

        /// <summary>
        /// 1. Call the function to read from Odbc Data source
        /// 2. Call the function to Write Tag values to InfluxDB
        /// </summary>
        public void UpdateTagValue(object isHistorical)
        {
            PollTime = DateTime.UtcNow;
            logger.Debug($"pollTime: {PollTime}");
            WriteTSDB(PollTime, (bool)isHistorical);
            var endtime = DateTime.UtcNow;
            logger.Debug($"Thread stopped at {endtime}");
        }

        private DataTable ReadOdbcTagData()
        {
            // Implement logic to read here

            // 1. This is loop is to ensure Last time to Tag instances (ie. DeviceMode.Tags__LastReadTime) are Added
            var odbcDeviceModel = DeviceModel as CollectOdbcDevice;
            DataSet tagLastTimes = ReadLastTimeDataFromTSDB();
            if (tagLastTimes.Tables.Count == 0)
                logger.Debug("No previous Data obtained for tagLastTimes check");
            else
            {
                logger.Debug("There are new values to save into TSDB");
                logger.Debug("First table contains :");
                logger.Debug(tagLastTimes.Tables[0].Rows.Count);
            }

            logger.Debug("ReadOdbcTagDataStep1");
            foreach (var tag in DeviceModel.Tags)
            {
                bool isLastTimeSet = false;
                var tagModelInstance = tag as CollectOdbcTag;
                string tagGuid = tagModelInstance.TagId.ToString();

                // This is to ensure, if TSDB is returning multiple Tables, it should
                // also hanlded.
                foreach (DataTable lastTable in tagLastTimes.Tables)
                {
                    var value = lastTable.Select().
                        FirstOrDefault(
                        x =>
                        x["TAGID"].ToString() == tagGuid
                        );
                    if (value != null)
                    {
                        var timeLastRead = value["time"];
                        logger.Debug("TAGID");
                        logger.Debug(value["TAGID"]);
                        logger.Debug("TagIdValue");
                        logger.Debug(tagModelInstance.TagIdValue);
                        tagModelInstance.LastReadTime = DateTime.Parse(timeLastRead.ToString());
                        isLastTimeSet = true;
                    }
                }

                // This last time set, then next tag is to be considered
                if (isLastTimeSet)
                {
                    logger.Debug("item.LastReadTime");
                    logger.Debug(tagModelInstance.LastReadTime);
                    continue;
                }
            }

            logger.Debug("ReadOdbcTagDataStep2");
            // 2. Now generate query based on TagIdValue and Datecolumn
            List<string> whereConditions = new List<string>();

            var OdbcValueDataTable = new DataTable();
            foreach (var tag in DeviceModel.Tags)
            {
                var tagModelInstance = tag as CollectOdbcTag;
                string idColumnName = odbcDeviceModel.IdColumn;
                string idColumnValue = tagModelInstance.TagIdValue;
                string dateColumnName = odbcDeviceModel.DateColumn;
                // Assuming it's not null
                string qry = "";
                if (tagModelInstance.LastReadTime != null)
                {
                    DateTime lastValueConverted = (DateTime)tagModelInstance.LastReadTime;
                    string dateColumnValue = lastValueConverted.
                                                         ToString("yyyy-MM-dd HH:mm:ss",
                                                         CultureInfo.InvariantCulture);
                    qry = $@" {idColumnName} = {idColumnValue}
AND
{dateColumnName} > '{dateColumnValue}'";
                    whereConditions.Add(qry);
                }
                else
                {
                    qry = $"{ idColumnName} = {idColumnValue}";
                    whereConditions.Add(qry);
                }
                logger.Debug("qry");
                logger.Debug(qry);
            }

            logger.Debug("ReadOdbcTagDataStep3");
            // 3. Now fetch new values and return
            var columns = odbcDeviceModel.GetColumnList();
            string sqlQuery = new SelectQueryGeneratorODBC(columns, odbcDeviceModel.TableName, new string[] { }, whereConditions.ToArray()).BuildQuery();

            logger.Debug($"SQLQuery for reading Tag values {sqlQuery}");

            using (var odbcHelper = new OdbcHelper(odbcDeviceModel.Dsn, true))
            {
                var dataset = odbcHelper.ExecDataSet(sqlQuery);
                OdbcValueDataTable = dataset.Tables[0];
                logger.Debug("DataTable Rows Count");
                logger.Debug(OdbcValueDataTable.Rows.Count);
            }

            return OdbcValueDataTable;
        }

        private DataSet ReadLastTimeDataFromTSDB()
        {
            logger.Debug("ReadLastTimeDataFromTSDB");
            List<string> influxQueries = new List<string>();
            foreach (var item in DeviceModel.Tags)
            {
                string qry = $@"select * from TagValues where TAGID='{item.TagId}' order by time desc limit 1";
                qry = qry.Trim();
                logger.Debug("SelectQueryForLastTimeReadFromTSDB");
                logger.Debug(qry);
                influxQueries.Add(qry);
            }

            logger.Debug("influxQueries");
            logger.Debug(influxQueries.Count);
            return tsdb.ReadTSDB(influxQueries.ToArray());
        }

        /// <summary>
        /// Write each tag item to InfluxDB
        /// </summary>
        private void WriteTSDB(DateTime pt, bool isHistorical)
        {
            try
            {
                int tagValueCounter = 0;
                var odbcDeviceModel = DeviceModel as CollectOdbcDevice;

                logger.Debug($"Start: Read All Data From TSDB with consideration of lasttime {DateTime.UtcNow}");
                // Since, the time and Value should come from ODBC
                // Also remember, there will be multiple values for single tag itself,
                // so you will see another loop below this
                DataTable dt = ReadOdbcTagData();
                logger.Debug($"ReadOdbcTagData.Count {dt.Rows.Count}");
                logger.Debug($"End: Read All Data From TSDB with consideration of lasttime {DateTime.UtcNow}");

                logger.Debug($"UTCNow before AllTags TSDB Inserts: {DateTime.UtcNow}");
                logger.Debug($"DeviceModel.Tags :{DeviceModel.Tags.Count}");
                foreach (var tagItem in DeviceModel.Tags)
                {
                    var odbcTagModel = tagItem as CollectOdbcTag;
                    logger.Debug($"DeviceModel.Tags.Count :{DeviceModel.Tags.Count}");
                    logger.Debug($"TagIdValue: {odbcTagModel.TagIdValue}");
                    string tagIdColumnValue = odbcTagModel.TagIdValue;
                    string tagIdColumnName = odbcDeviceModel.IdColumn;

                    var results = dt.Select().Where(x => x[tagIdColumnName].ToString() == tagIdColumnValue);
                    logger.Info($"Tag results({tagIdColumnValue}):{results.Count()}");

                    logger.Info($"UTCNow before each tag results TSDB Inserts: {DateTime.UtcNow}");

                    // Create new stopwatch
                    Stopwatch stopwatch = new Stopwatch();
                    // Begin timing
                    stopwatch.Start();
                    foreach (var val in results)
                    {
                        odbcTagModel.Value = val[odbcDeviceModel.ValueColumn];
                        // Since, the time should come from ODBC
                        DateTime pt1 = (DateTime)val[odbcDeviceModel.DateColumn];

                        tsdb.InsertTSDB(tagItem, pt1, isHistorical);

                        tagValueCounter++;
                        logger.Debug($"NewlyCreatedTagValueCounter: {tagValueCounter}");
                    }

                    // Stop timing
                    stopwatch.Stop();
                    var timeForInsertTSDB = stopwatch.Elapsed.TotalMilliseconds;
                    logger.Info($"timeForInsertTSDB in (ms): {timeForInsertTSDB}|TagId in ODBC: {tagIdColumnValue}|Count:{results.Count()}");

                    logger.Info($"UTCNow After each tag results TSDB Inserts: {DateTime.UtcNow}");
                }
                logger.Info($"UTCNow After  AllTags TSDB Inserts: {DateTime.UtcNow}");
            }
            catch (Exception tsdbEx)
            {
                logger.Error("{0} || {1}", "**Write to TSDB failed**", tsdbEx);
            }
        }

        /// <summary>
        /// Write each tag item to Historical InfluxDB
        /// </summary>
        public void WriteHistoricalTSDB()
        {
            try
            {
                HistoricalPollTime = DateTime.UtcNow;
                WriteTSDB(PollTime, true);
            }
            catch (Exception tsdbEx)
            {
                logger.Error("{0} || {1}", "**Write to Historian TSDB failed**", tsdbEx);
            }
        }
    }
}
