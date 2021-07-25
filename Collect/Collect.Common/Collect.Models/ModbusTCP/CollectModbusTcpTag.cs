//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;
using System.Xml.Serialization;

namespace Collect.Models
{
    /// <summary>
    /// This is the model used for representing CollectModbusTcpTag
    /// </summary>
    [XmlRoot(ElementName = "CollectModbusTcpTag")]
    public class CollectModbusTcpTag : ICollectTag, ICollectServiceTag
    {
        #region ICollectTag

        public string TagName { get; set; }
        public dynamic Value { get; set; }
        public Guid TagId { get; set; }

        #endregion ICollectTag

        public ICollectServiceDevice Device { get; set; }
        public int Address { get; set; }
        public ModbusTagDataType DataType { get; set; }
        public ModbusRegisterType RegisterType { get; set; }
        public decimal MultiplicationFactor { get; set; }

        public string ParentFullName { get; set; }

        public CollectModbusTcpTag()
        { }

        public string GetTagInfo()
        {
            var tcpDevice = Device as CollectModbusTcpDevice;
            return $"{tcpDevice.Name}:{tcpDevice.IPAddress}:{tcpDevice.SlaveID}:{TagName}:{TagId}";
        }
    }
}
