//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Common.Service;
using Collect.Models;
using Collect.Talk2MWrapper;
using Common.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace Collect.Talk2M.Service
{
    public partial class CollectTalk2MServer : CollectServiceCommonBase
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public CollectTalk2MServer(ICollectServiceDeviceManager deviceManager) : base(deviceManager)
        {
            logger.Debug("CollectTalk2MServer");
            DeviceManager = new CollectTalk2MDeviceManager();
            DeviceSignature = CollectCommonConstants.DeviceSignatureTalk2M;
        }
    }
}
