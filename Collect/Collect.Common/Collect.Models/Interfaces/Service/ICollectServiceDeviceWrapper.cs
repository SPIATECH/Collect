//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;

namespace Collect.Models
{
    /// <summary>
    /// This interface summarises all common properties and methods needed by a Collect service as CollectDeviceWrapper
    /// </summary>
    public interface ICollectServiceDeviceWrapper
    {
        DateTime HistoricalPollTime { get; set; }
        DateTime PollTime { get; set; }
        ICollectServiceDevice DeviceModel { get; set; }

        void UpdateTagValue(object isHistorical);

        void WriteHistoricalTSDB();
    }
}
