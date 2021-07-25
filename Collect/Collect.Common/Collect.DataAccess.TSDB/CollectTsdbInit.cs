//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using InfluxData.Net.InfluxDb;
using InfluxData.Net.InfluxDb.Models;
using InfluxData.Net.InfluxDb.Models.Responses;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Collect.DataAccess.TSDB
{
    public class CollectTsdbInit
    {
        private readonly string tsdbConString;
        private readonly string tsdbUsername;
        private readonly string tsdbPassword;
        private readonly string RealTimeRP_Hour;
        private readonly string RealTimeRP_Minute;
        private readonly string RealTimeRP_Second;
        private readonly string HistoricalRP_Hour;
        private readonly string HistoricalRP_Minute;
        private readonly string HistoricalRP_Second;
       
        public CollectTsdbInit(string tsdbConString, string tsdbUsername, string tsdbPassword,string RealTimeRP_Hour,string RealTimeRP_Minute,string RealTimeRP_Second,string HistoricalRP_Hour,string HistoricalRP_Minute,string HistoricalRP_Second )
        {
            this.tsdbConString = tsdbConString;
            this.tsdbUsername = tsdbUsername;
            this.tsdbPassword = tsdbPassword;
            this.RealTimeRP_Hour = RealTimeRP_Hour;
            this.RealTimeRP_Minute = RealTimeRP_Minute;
            this.RealTimeRP_Second = RealTimeRP_Second;
            this.HistoricalRP_Hour = HistoricalRP_Hour;
            this.HistoricalRP_Minute = HistoricalRP_Minute;
            this.HistoricalRP_Second = HistoricalRP_Second;
        }

        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// Create a database and set retention policy for realtime and historical and insert a dummy value so that column datatype of Value will be of float
        /// </summary>
        public async Task initTSDB()
        {
            
            try
            {
                logger.Info("Started");
                Boolean databaseExistRT = false;
                Boolean databaseExistHT = false;
                var _client = new InfluxDbClient(tsdbConString, tsdbUsername, tsdbPassword, InfluxData.Net.Common.Enums.InfluxDbVersion.Latest);

                try
                {
                    IEnumerable<Database> databases = await _client.Database.GetDatabasesAsync();

                    foreach (var d in databases)
                    {
                        if (d.Name.ToString() == "active_realtime")
                        {
                            databaseExistRT = true;
                        }
                        else if (d.Name.ToString() == "active_historical")
                        {
                            databaseExistHT = true;
                        }
                    }
                    // Add measurements
                }
                catch (Exception InsertingInitialVal)
                {
                    logger.Error("{0} || {1}", "**Checking Database Existance Failed**", InsertingInitialVal);
                }

                if (!databaseExistRT)
                    await _client.Database.CreateDatabaseAsync("active_realtime");
                if (!databaseExistHT)
                    await _client.Database.CreateDatabaseAsync("active_historical");
               
                var realtimeQuery = "CREATE RETENTION POLICY Pol_RP ON active_realtime DURATION " + RealTimeRP_Hour +
                                                                                        RealTimeRP_Minute +
                                                                                        RealTimeRP_Second +
                                                                                        " REPLICATION 1 DEFAULT";
                var historicalQuery = "CREATE RETENTION POLICY Pol_RP ON active_historical DURATION " + HistoricalRP_Hour +
                                                                                        HistoricalRP_Minute +
                                                                                        HistoricalRP_Second +
                                                                                        " REPLICATION 1 DEFAULT";
                try
                {
                    await _client.Client.QueryAsync(realtimeQuery, "active_realtime");
                    await _client.Client.QueryAsync(historicalQuery, "active_historical");
                }
                catch (Exception retentionPolicy)
                {
                    logger.Error("{0} || {1}", "**Influx DB Retention Policy Failed**", retentionPolicy);
                }

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

                    Tag_pt.Add("TAGID", Guid.Empty.ToString());
                    Fields_pt.Add("VALUE", 1.11);

                    var pointToWrite = new Point()
                    {
                        Name = "TagValues",

                        Tags = Tag_pt,

                        Fields = Fields_pt,

                        Timestamp = DateTime.UtcNow // optional (can be set to any DateTime moment)
                    };
                    if (!databaseExistRT && !databaseExistHT)
                    {
                        await _client.Client.WriteAsync(pointToWrite, "active_realtime");
                        await _client.Client.WriteAsync(pointToWrite, "active_historical");
                    }

                    logger.Info("Completed");
                }
                catch (Exception tsdb_write)
                {
                    logger.Error("{0} || {1}", "**Initialising TSDB DATA ERROR**", tsdb_write);
                }
                logger.Info("**Influx DB Initialised**");
            }
            catch (Exception tsdb_create)
            {
                logger.Error("DATABASE ERROR or Database already exist");
                logger.Error("{0} || {1}", "**Influx DB Initialising Failed or Database already exist**", tsdb_create.ToString());
            }
        }
    }
}
