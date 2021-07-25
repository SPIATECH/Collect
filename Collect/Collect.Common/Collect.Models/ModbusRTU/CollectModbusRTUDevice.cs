//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;

namespace Collect.Models
{
    /// <summary>
    /// RTU Device Class
    /// </summary>
    public class CollectModbusRTUDevice
    {
        public string ComPort { get; set; }
        public StopBits StopBit { get; set; }
        public Parity Parity { get; set; }
        public int DataBit { get; set; }
        public int BaudRate { get; set; }
        public byte SlaveID { get; set; }
        public int RetryCount { get; set; }
        public string Name { get; set; }
        public int Id { get; set; }
        public int ReadTimeout { get; set; }
        public int WaitToRetry { get; set; }
        public int DeviceTimeout { get; set; }
        public List<CollectModbusRTUTag> Tags { get; set; }
    }
}
