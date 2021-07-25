//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;
using Collect.Models;
using NLog;
using System.Configuration;

namespace Collect.ModbusWrapper
{
    public class CollectRtuTestWrapper
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        private readonly ModbusRtuWrapper n = new ModbusRtuWrapper();
        public ushort[] holdingRegisters { get; set; }
        private readonly CollectModbusRTUDevice device = new CollectModbusRTUDevice();
        private readonly SerialPort ComPort = new SerialPort();
        public static string ComPortConfig;
        public CollectRtuTestWrapper()
        {
            device.ComPort = ComPortConfig;
            device.SlaveID = 1;
            device.BaudRate = 9600;
            device.DataBit = 8;
            device.Parity = Parity.None;
            device.StopBit = StopBits.One;
            device.RetryCount = 3;
            device.ReadTimeout = 3000;
            device.WaitToRetry = 1000;
            device.DeviceTimeout = 3000;
            ComPort.PortName = device.ComPort;
            ComPort.BaudRate = device.BaudRate;
            ComPort.DataBits = device.DataBit;
            ComPort.Parity = device.Parity;
            ComPort.StopBits = device.StopBit;
            ReadHoldingRegisters();
        }

        public void ReadHoldingRegisters()
        {
            try
            {
                ushort startAddress = 0, registerLengthToBeRead = 1;
                if (registerLengthToBeRead != 0)
                {
                    holdingRegisters = n.RTUReadHoldingRegisters(ComPort, device.SlaveID, startAddress, registerLengthToBeRead, device.RetryCount, device.ReadTimeout, device.WaitToRetry, device.DeviceTimeout);
                    logger.Info("{0} {1}", "Register Value =", holdingRegisters[0]);
                }
            }
            catch (Exception rhEx)
            {
                logger.Error("{0} || {1}", "**ReadHoldingRegisters**", rhEx);
            }
        }
    }
}
