//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InfluxData.Net;
using InfluxData.Net.InfluxDb.Models;
using InfluxData.Net.InfluxDb.Infrastructure;
using Collect.Models;
using System.Configuration;
using NLog;
using InfluxData.Net.InfluxDb;
using Collect.Models.Interface;
using System.Data;
using System.Diagnostics;
using Common.Models;

namespace Collect.DataAccess.TSDB
{
    public class CollectTsdb
    {      
        private readonly InfluxData.Net.InfluxDb.ClientSubModules.IBatchWriter batchWriterRT;
        private readonly InfluxData.Net.InfluxDb.ClientSubModules.IBatchWriter batchWriterHT;
        private readonly InfluxDbClient _client;
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        public static bool IsPurgeSuccessful = false;
      
        public CollectTsdb(string UserName, string Password, string Tsdb)
        {         
            _client = new InfluxDbClient(Tsdb, UserName,Password, InfluxData.Net.Common.Enums.InfluxDbVersion.Latest);
            batchWriterRT = _client.Serie.CreateBatchWriter(tsdbConstants.realtimeDatabaseName);
            batchWriterHT = _client.Serie.CreateBatchWriter(tsdbConstants.historicalDatabaseName);
            batchWriterRT.Start(1000, true);
            batchWriterHT.Start(1000, true);
        }

        /// <summary>
        /// Write Tags to InfluxDB
        /// </summary>
        /// <param name="tag">
        /// Tag Details
        /// </param>
        /// <returns></returns>
        public void InsertTSDB(ICollectServiceTag tag, DateTime pollTime, bool isHistorical)
        {
            try
            {
                Dictionary<string, object> Tag_pt = null;
                Dictionary<string, object> Fields_pt = null;

                Tag_pt = new Dictionary<string, object>()
                {
                };
                Fields_pt = new Dictionary<string, object>()
                {
                };

                if (tag.TagId != Guid.Empty)
                {
                    Tag_pt.Add("TAGID", tag.TagId);
                    string taginfo = tag.GetTagInfo();
                    Tag_pt.Add("TAGINFO", taginfo);
                    logger.Debug(taginfo);
                }

                if (tag.Value != null)
                {
                    Fields_pt.Add("VALUE", Convert.ToDecimal(tag.Value));
                }

                var pointToWrite = new Point()
                {
                    Name = "TagValues",

                    Tags = Tag_pt,

                    Fields = Fields_pt,

                    Timestamp = pollTime // optional (can be set to any DateTime moment)
                };

                //Write to real time database
                batchWriterRT.AddPoint(pointToWrite);
                logger.Debug("DATA INSERTED to " + TsdbDatabase.Realtime + $", TAGINFO: {tag.GetTagInfo()}" + ", TAGID: " + tag.TagId + ", Value: " + tag.Value + " Time:" + pollTime);

                //If historical flag is set, write to historical db
                if (isHistorical)
                {
                    batchWriterHT.AddPoint(pointToWrite);
                    logger.Debug("DATA INSERTED to " + TsdbDatabase.Historical + $", TAGINFO: {tag.GetTagInfo()}" + ", TAGID: " + tag.TagId + ", Value: " + tag.Value + " Time:" + pollTime);
                }
            }
            catch (Exception tsdb_write)
            {
                logger.Error("{0} || {1}", "**InsertTSDB Failed**", tsdb_write);
            }
        }

        public DataSet ReadTSDB(string[] queries, string database = tsdbConstants.historicalDatabaseName)
        {
            var response = _client.Client.QueryAsync(queries, database);
            DataSet allDataSet = new DataSet();

            foreach (var rowset in response.Result)
            {
                DataTable dt = new DataTable();
                foreach (var item in rowset.Columns)
                {
                    dt.Columns.Add(item);
                }
                foreach (var item in rowset.Values)
                {
                    DataRow dr = dt.NewRow();
                    foreach (var colvalue in item.Select((value, i) => new { value, i }))
                    {
                        dr[colvalue.i] = colvalue.value;
                    }
                    dt.Rows.Add(dr);
                    logger.Trace($"item = {item}");
                }
                allDataSet.Tables.Add(dt);
            }
            return allDataSet;
        }
        //Function to clear all the Tag Values from TSDB
        public async Task ClearAllTagValues()
        {
            try
            {
                string measurementName = tsdbConstants.tsdbMeasurementName;
                logger.Info("Dropping all series from active_realtime");
                //To clear all Tag values in active_realtime database
                var activeRT_response = await _client.Serie.DropSeriesAsync(tsdbConstants.realtimeDatabaseName, measurementName);
                logger.Info("Dropping all series from active_historical");
                //To clear all Tag values in active_historical database
                var activeHT_response = await _client.Serie.DropSeriesAsync(tsdbConstants.historicalDatabaseName, measurementName);
                logger.Info("Purge Successful");
                IsPurgeSuccessful = true;
            }
            catch(Exception ex)
            {
                logger.Error("Purge Failed:"+ex);
                IsPurgeSuccessful = false;
            }

        }
    }
}
