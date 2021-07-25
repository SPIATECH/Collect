//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Collect.Models;
using NLog;
using Collect.Common.Service;
using Collect.Talk2MWrapper;
using Common.Models;
using Collect.DataAccess.RDBMS;
using Common.Utils.Models;

namespace Collect.Talk2M.Service
{
    static class Program
    {

        private static readonly Logger logger = LogManager.GetCurrentClassLogger();

        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
        {
            logger.Info("Assigning Configuration values in Collect service started");
            CollectTalk2MServiceConfiguration cnf = new CollectTalk2MServiceConfiguration();
            Utils.ConfigureLoggerLevel(CollectTalk2MServiceConfiguration.LogLevel);
            logger.Info("Logger Level Reconfiguration Done");

            CollectTalk2MDeviceManager.Connection = CollectTalk2MServiceConfiguration.TsdbServer;
            CollectTalk2MDeviceManager.UserName = tsdbConstants.tsdbWriteUsername;
            CollectTalk2MDeviceManager.Password = tsdbConstants.tsdbWritePassword;
            CollectTalk2MDeviceManager.CountNeeded = CollectTalk2MServiceConfiguration.ThreadSkipWarnCount;
            CollectTalk2MDeviceManager.RealTimeRP_Hour = CollectTalk2MServiceConfiguration.RealTimeRP_Hour;
            CollectTalk2MDeviceManager.RealTimeRP_Minute = CollectTalk2MServiceConfiguration.RealTimeRP_Minute;
            CollectTalk2MDeviceManager.RealTimeRP_Second = CollectTalk2MServiceConfiguration.RealTimeRP_Second;
            CollectTalk2MDeviceManager.HistoricalRP_Hour = CollectTalk2MServiceConfiguration.HistoricalRP_Hour;
            CollectTalk2MDeviceManager.HistoricalRP_Minute = CollectTalk2MServiceConfiguration.HistoricalRP_Minute;
            CollectTalk2MDeviceManager.HistoricalRP_Second = CollectTalk2MServiceConfiguration.HistoricalRP_Second;
            CollectTalk2MDeviceWrapper.Tsdb = CollectTalk2MServiceConfiguration.TsdbServer;
            CollectTalk2MDeviceWrapper.Username = tsdbConstants.tsdbWriteUsername;
            CollectTalk2MDeviceWrapper.Password = tsdbConstants.tsdbWritePassword;
            CollectServiceCommonBase.BrokerUrl = CollectTalk2MServiceConfiguration.BrokerUrl;
            AdoHelper.ConnectionString = CollectTalk2MServiceConfiguration.ConnectionString;
            logger.Info("Assigning Configuration values in Collect service ended");


            ServiceBase[] ServicesToRun;
            ICollectServiceDeviceManager deviceManager = new CollectTalk2MDeviceManager();
            ServicesToRun = new ServiceBase[]
            {
                new CollectTalk2MServer(deviceManager)
            };
            logger.Info("Collect service about to start");
            ServiceBase.Run(ServicesToRun);
        }
    }
}
