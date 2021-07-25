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
using System.Windows.Forms;
using Common.Models;
using Common.Utils.Models;

namespace Collect.Master.Service
{
    /// <summary>
    /// This class read all configration on application startup
    /// </summary>
    public class CollectMasterServiceConfiguration: ConfigReader
    {
        public override String ConfigPath
        {
            get
            {
                return CollectMasterServiceConstants.ConfigPath;
            }
        }
        public static string BrokerUrl;
        public static string TsdbServer;
        public static string ConnectionString;
        public static string LogLevel;
        public static bool LaunchWebServer; 
        public static bool LaunchInfluxDb; 
        public static string AppsToRun;
        public static string InfluxVersion;
        public static bool IsInfluxDBLogEnabled;
    }
}
