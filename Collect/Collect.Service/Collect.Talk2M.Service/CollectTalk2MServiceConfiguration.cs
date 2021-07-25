//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Utils.ConfigReadingCommon;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Common.Models;
using Common.Utils.Models;


namespace Collect.Talk2M.Service
{
    /// <summary>
    /// This class read all configration on application startup
    /// </summary>
  public class CollectTalk2MServiceConfiguration : ConfigReader
    {
        public override String ConfigPath
        {
            get
            {
                return CollectCommonConstants.talk2MConfigPath;
            }
        }

        public static string TsdbServer;
        public static string RealTimeRP_Minute;
        public static string RealTimeRP_Hour;
        public static string RealTimeRP_Second;
        public static string HistoricalRP_Minute;
        public static string HistoricalRP_Hour;
        public static string HistoricalRP_Second;
        public static int ThreadSkipWarnCount;
        public static string BrokerUrl;
        public static string ConnectionString;
        public static string LogLevel;
    }
}
