//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Common.Service;
using Collect.Models;
using Common.Models;

namespace Collect.Service.ODBC
{
    public partial class CollectServiceOdbc : CollectServiceCommonBase
    {
        public CollectServiceOdbc(ICollectServiceDeviceManager deviceManager) : base(deviceManager)
        {
            DeviceSignature = CollectCommonConstants.DeviceSignatureOdbc;
        }
    }
}