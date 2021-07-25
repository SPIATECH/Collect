//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Collect.Models
{
    /// <summary>
    /// Tag Class
    /// </summary>
    public class CollectModbusRTUTag
    {
        public string TagName { get; set; }
        public CollectModbusTcpDevice Device { get; set; }
        public int Address { get; set; }
        public ModbusTagDataType DataType { get; set; }
        public ModbusRegisterType RegisterType { get; set; }
        public dynamic Value { get; set; }
        public int ID { get; set; }
        public decimal MultiplicationFactor { get; set; }

        /// <summary>
        /// CollectModbusRTUTag Constructor
        /// </summary>
        /// <param name="registertype"></param>
        /// <param name="address"></param>
        /// <param name="datatype"></param>
        /// <param name="value"></param>
        /// <param name="id"></param>
        /// <param name="tagname"></param>
        /// <param name="multiplicationFactor"></param>
        /// <param name="dev"></param>
        public CollectModbusRTUTag(ModbusRegisterType registertype, int address, ModbusTagDataType datatype, dynamic value, int id, string tagname, decimal multiplicationFactor, CollectModbusTcpDevice dev)
        {
            this.Address = address;
            this.DataType = datatype;
            this.RegisterType = registertype;
            this.Value = value;
            this.ID = id;
            this.TagName = tagname;
            this.MultiplicationFactor = multiplicationFactor;
            this.Device = dev;
        }
    }
}
