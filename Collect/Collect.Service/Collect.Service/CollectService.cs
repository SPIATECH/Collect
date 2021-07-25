//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Common.Service;
using Collect.ModbusWrapper;
using Collect.Models;
using Common.Models;
using NLog;
using System;

namespace Collect.Service
{
    public partial class CollectService : CollectServiceCommonBase
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public CollectService(ICollectServiceDeviceManager deviceManager) : base(deviceManager)
        {
            logger.Debug("Ctor");
            DeviceManager = new CollectTcpDeviceManager();
            DeviceSignature = CollectCommonConstants.DeviceSignatureModbusTcp;
            DeviceRegistration = CollectCommonConstants.DeviceRegistration_MODTCP;
            TagRegistration = CollectCommonConstants.TagRegistration_MODTCP;
        }

        public void RunAsConsole(string[] args)
        {
            OnStart(args);
            logger.Info("Collect ModbusTCP server is running.");
            
            //loop to keep the exe alive in console mode.
            while (true)
            {

            }
        }
    }
}
