//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models;
using Collect.Wrapper.ODBC;
using NLog;
using System;
using System.ServiceProcess;
using Common.Models;
using Common.Utils.Models;

namespace Collect.Service.ODBC
{
    internal static class Program
    {
        private static readonly Logger loggerstatic = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        private static void Main()
        {
            CollectOdbcServiceConfiguration cnf = new CollectOdbcServiceConfiguration();
            Utils.ConfigureLoggerLevel(CollectOdbcServiceConfiguration.LogLevel);

            CollectOdbcDeviceManager.HistoricalRP_Hour = CollectOdbcServiceConfiguration.HistoricalRP_Hour;
            CollectOdbcDeviceManager.HistoricalRP_Minute = CollectOdbcServiceConfiguration.HistoricalRP_Minute;
            CollectOdbcDeviceManager.HistoricalRP_Second = CollectOdbcServiceConfiguration.HistoricalRP_Second;
            CollectOdbcDeviceManager.RealTimeRP_Hour = CollectOdbcServiceConfiguration.RealTimeRP_Hour;
            CollectOdbcDeviceManager.RealTimeRP_Minute = CollectOdbcServiceConfiguration.RealTimeRP_Minute;
            CollectOdbcDeviceManager.RealTimeRP_Second = CollectOdbcServiceConfiguration.RealTimeRP_Second;
            CollectOdbcDeviceManager.Tsdb = CollectOdbcServiceConfiguration.Tsdb;
            CollectOdbcDeviceManager.UserName = tsdbConstants.tsdbWriteUsername;
            CollectOdbcDeviceManager.Password = tsdbConstants.tsdbWritePassword;
            CollectOdbcDeviceWrapper.Tsdb = CollectOdbcServiceConfiguration.Tsdb;
            CollectOdbcDeviceWrapper.UserName = tsdbConstants.tsdbWriteUsername;
            CollectOdbcDeviceWrapper.Password = tsdbConstants.tsdbWritePassword;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            ServiceBase[] ServicesToRun;
            ICollectServiceDeviceManager deviceManager = new CollectOdbcDeviceManager();
            ServicesToRun = new ServiceBase[]
            {
                new CollectServiceOdbc(deviceManager)
            };
            ServiceBase.Run(ServicesToRun);
        }

        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            HandleException((Exception)e.ExceptionObject);
        }

        private static void HandleException(Exception e)
        {
            loggerstatic.Error(e.ToString(), "Unhandled exception in Service");
        }
    }
}
