//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.ModbusWrapper;
using Collect.Models;
using Common.Utils.Models;
using System.ServiceProcess;

namespace Collect.ModbusRTU.Service
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        private static void Main()
        {
            ModbusRtuServiceConfiguration cnf = new ModbusRtuServiceConfiguration();
            Utils.ConfigureLoggerLevel(ModbusRtuServiceConfiguration.LogLevel);

            CollectRtuTestWrapper.ComPortConfig = ModbusRtuServiceConfiguration.ComPort;
            ServiceBase[] ServicesToRun;
            ICollectServiceDeviceManager deviceManager = new CollectModbusRtuDeviceManager();
            ServicesToRun = new ServiceBase[]
            {
                new ModbusRtuService(deviceManager)
            };
            ServiceBase.Run(ServicesToRun);
        }
    }
}