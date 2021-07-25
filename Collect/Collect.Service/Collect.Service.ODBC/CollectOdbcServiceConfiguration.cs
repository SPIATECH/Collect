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

namespace Collect.Service.ODBC
{
    /// <summary>
    /// This class read all configration on application startup
    /// </summary>
    public class CollectOdbcServiceConfiguration : ConfigReader
    {
        public static string Config;
        public static string Tsdb;
        public static double PollingRate;
        public static double LoggingRate;
        public static string RealTimeRP_Minute;
        public static string RealTimeRP_Hour;
        public static string RealTimeRP_Second;
        public static string HistoricalRP_Minute;
        public static string HistoricalRP_Hour;
        public static string HistoricalRP_Second;
        public static string ConnectionString;
        public static string LogLevel;


    }
}
