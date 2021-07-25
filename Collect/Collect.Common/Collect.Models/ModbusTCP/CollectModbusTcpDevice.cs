//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace Collect.Models
{
    /// <summary>
    /// This is the model used for representing CollectModbusTcpDevice
    /// </summary>
    [XmlRoot(ElementName = "CollectModbusTcpDevice")]
    public class CollectModbusTcpDevice : ICollectDevice, ICollectServiceDevice
    {
        #region Properties

        #region ICollectDevice

        public Guid DeviceId { get; set; }
        public string DeviceType { get; set; }
        public string Name { get; set; }

        [XmlIgnore]
        public List<ICollectServiceTag> Tags { get; set; }

        #endregion ICollectDevice

        public string IPAddress { get; set; }
        public byte SlaveID { get; set; }
        public int Port { get; set; }
        public int RetryCount { get; set; }

        public int ReadTimeout { get; set; }
        public int WaitToRetry { get; set; }
        public int DeviceTimeout { get; set; }

        #endregion Properties

        public CollectModbusTcpDevice(int retryCount, string ipAddress, byte slaveID, int port, String name, Guid deviceId, int readTimeout, int waitToRetry, int deviceTimeout)
        {
            this.RetryCount = retryCount;
            this.IPAddress = ipAddress;
            this.SlaveID = slaveID;
            this.Port = port;
            this.DeviceId = deviceId;
            this.Name = name;
            this.ReadTimeout = readTimeout;
            this.WaitToRetry = waitToRetry;
            this.DeviceTimeout = deviceTimeout;
            Tags = new List<ICollectServiceTag> { };
        }

        public CollectModbusTcpDevice()
        {
        }
    }
}
