//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Common.Service;
using Collect.Models;
using Common.Models;

namespace Collect.ModbusRTU.Service
{
    public partial class ModbusRtuService : CollectServiceCommonBase
    {
        public ModbusRtuService(ICollectServiceDeviceManager deviceManager) : base(deviceManager)
        {
            DeviceSignature = CollectCommonConstants.DeviceSignatureModbusRtu;
        }
    }
}