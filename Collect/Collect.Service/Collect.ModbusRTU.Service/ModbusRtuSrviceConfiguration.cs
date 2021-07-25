//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Common.Utils.Models;

namespace Collect.ModbusRTU.Service
{
    /// <summary>
    /// This class read all configration on application startup
    /// </summary>
    public class ModbusRtuServiceConfiguration : ConfigReader
    {
      
        public static double realtimeRate;
        public static double historicalRate;
        public static string RealTimeRP_Minute;
        public static string RealTimeRP_Hour;
        public static string RealTimeRP_Second;
        public static string HistoricalRP_Minute;
        public static string HistoricalRP_Hour;
        public static string HistoricalRP_Second;
        public static string ComPort;
        public static string ConnectionString;
        public static string LogLevel;

    }
}
