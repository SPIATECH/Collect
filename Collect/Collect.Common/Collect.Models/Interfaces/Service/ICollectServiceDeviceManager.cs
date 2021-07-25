//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System.Collections.Generic;
using System.Threading;

namespace Collect.Models
{
    /// <summary>
    /// This interface summarises all common properties and methods needed by a Collect service as CollectDeviceManager
    /// </summary>
    public interface ICollectServiceDeviceManager
    {
        List<ICollectServiceDeviceWrapper> Devices { get; set; }
        List<Thread> Threads { get; set; }
        string TsdbConString { get; set; }
        string TsdbPassword { get; set; }
        string TsdbUsername { get; set; }
        string AllDevicesAndTagsJson { get; set; }

        void GetListofDevices();

        void UpdateAllDeviceTags(bool isHistorical);
    }
}
