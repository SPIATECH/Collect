//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System.Collections.Generic;
using System.Threading;
using Collect.Models;

namespace Collect.ModbusRTU.Service
{
    internal class CollectModbusRtuDeviceManager : ICollectServiceDeviceManager
    {
        public List<ICollectServiceDeviceWrapper> Devices { get => throw new System.NotImplementedException(); set => throw new System.NotImplementedException(); }
        public List<Thread> Threads { get => throw new System.NotImplementedException(); set => throw new System.NotImplementedException(); }
        public string TsdbConString { get => throw new System.NotImplementedException(); set => throw new System.NotImplementedException(); }
        public string TsdbPassword { get => throw new System.NotImplementedException(); set => throw new System.NotImplementedException(); }
        public string TsdbUsername { get => throw new System.NotImplementedException(); set => throw new System.NotImplementedException(); }
        public string AllDevicesAndTagsJson { get => throw new System.NotImplementedException(); set => throw new System.NotImplementedException(); }

        public void GetListofDevices()
        {
            throw new System.NotImplementedException();
        }

        public void UpdateAllDeviceTags(bool isHistorical)
        {
            throw new System.NotImplementedException();
        }
    }
}
