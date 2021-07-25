//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Common.Service;
using Collect.ModbusWrapper;
using Collect.Models;
using NLog;
using System.ServiceProcess;
using Collect.ModbusWrapper.ModbusHelper;
using Common.Models;
using Common.Utils.Models;
using System;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Collect.Service
{
    internal static class Program
    {
        private static readonly Logger logger = LogManager.GetCurrentClassLogger();
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        private static void Main()
        {
            logger.Info("Assigning Configuration values in Collect service started");
            // An instance is needed to invoke the constructor
            CollectServiceConfiguration cnf = new CollectServiceConfiguration();
            using (StreamReader reader = new StreamReader(cnf.ConfigPath))
            {
                string jsonConfig = reader.ReadToEnd();
                cnf = Serializer.JsonDeserializer<CollectServiceConfiguration>(jsonConfig);
            }

            //Configure log root path and log level
            Utils.ConfigureLogPath(LogFilePaths.CollectModbusTCPServerLogPath);
            Utils.ConfigureLoggerLevel(cnf.LogLevel);
            logger.Info("Logger Level and root path Reconfiguration Done");

            CollectTcpDeviceManager.UserName = tsdbConstants.tsdbWriteUsername;
            CollectTcpDeviceManager.Password = tsdbConstants.tsdbWritePassword;
            CollectTcpDeviceManager.DataSource = cnf.DataSource;
            ChunksCreater.ChunkSizeForBits = cnf.ChunkSizeForBits;
            ChunksCreater.ChunkSizeForWords = cnf.ChunkSizeForWords;

            CollectServiceCommonBase.BrokerUrl = cnf.BrokerUrl;

            logger.Info("Assigning Configuration values in Collect service ended");

            ICollectServiceDeviceManager deviceManager = new CollectTcpDeviceManager();
            CollectService collectService = new CollectService(deviceManager);

            logger.Info("Collect ModbusTCP driver running in console mode.");
            collectService.RunAsConsole(new string[] { });

            /*ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                collectService
            };
            logger.Info("Collect service about to start");
            ServiceBase.Run(ServicesToRun);*/
        }
    }
}