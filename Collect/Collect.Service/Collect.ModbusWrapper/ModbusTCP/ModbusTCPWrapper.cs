//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.ModbusWrapper.ModbusHelper;
using Modbus.Device;
using NLog;
using System;
using System.Configuration;
using System.Diagnostics;
using System.Net.Sockets;
using Common.Models;
using Collect.Models;
using System.Collections.Generic;

namespace Collect.ModbusWrapper
{
    /// <summary>
    /// Methods for polling data from devices
    /// </summary>
    public class ModbusWrapper
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        private TcpClient tcpClient;
        private ModbusIpMaster master;


        public ModbusWrapper()
        {
        }

        #region TCP methods


        public bool[] TCPReadCoils(string hostAddress, Int32 portNo, byte slaveId, ref List<ChunksModel> chunks, uint numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout, string deviceName)
        {
            bool[] registers = new bool[numRegisters];
            bool NetworkIsOk = false;
            try
            {
                logger.Debug("TCPReadCoils Started");   
                int index = 0;
                NetworkIsOk = connect(hostAddress, portNo, readTimeout, retryCount, waitToRetry, deviceTimeout, deviceName);

                if (NetworkIsOk)
                {
                    logger.Debug($"Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                    logger.Debug($"TCPReadCoils startOffset:{chunks[0].Offset} TotalLength:{numRegisters}");
                    foreach (var item in chunks)
                    {
                        if (item.IsTagPresent)
                        {
                            // Modbus address is 1 less than what user entered.
                            // Eg: If user entered address 00001, the Modbus offset is 0.
                            ushort modbusOffset = (ushort)(item.Offset);

                            logger.Debug($"TCPReadCoils Chunks::::  Offset:{modbusOffset} Length:{item.Length}");
                            try
                            {
                                master.ReadCoils(slaveId, modbusOffset, item.Length).CopyTo(registers, index);
                                item.IsReadSuccess = true;
                                logger.Trace($"Chunk {item.Offset} Read Success");

                            }
                            catch (Exception exception)
                            {
                                // This Chunk Read failed. We will continue to read the remaining chunks
                                ModbusExceptions(exception, hostAddress, deviceName);
                                item.IsReadSuccess = false;
                                logger.Debug($"Chunk {item.Offset} Read Failed");
                            }
                        }
                        else
                        {
                            logger.Info($"Chunk {item.Offset} is not valid. So Skipping Modbus Read");
                        }


                        logger.Trace($"Index={ index}");
                        index += item.Length;

                    }
                    master.Dispose();
                    tcpClient.Close();
                }
                else
                {
                    registers = null;
                    logger.Debug($"Network Failure : Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                }
                logger.Debug("TCPReadCoils Ended");
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception, hostAddress, deviceName);
                registers = null;
                return registers;
            }
        }

        public ushort[] TCPReadHoldingRegisters(string hostAddress, Int32 portNo, byte slaveId, ref List<ChunksModel> chunks, uint numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout, string deviceName)
        {
            ushort[] registers = new ushort[numRegisters];
            bool NetworkIsOk = false;
            try
            {
                logger.Debug($"TCPReadHoldingRegisters ({numRegisters}) Started");
                int index = 0;
                NetworkIsOk = connect(hostAddress, portNo, readTimeout, retryCount, waitToRetry, deviceTimeout, deviceName);

                if (NetworkIsOk)
                {
                    logger.Debug($"Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                    logger.Debug($"TCPReadHoldingRegisters  Offset:{chunks[0].Offset} TotalLength:{numRegisters}");
                    foreach (var item in chunks)
                    {
                        if (item.IsTagPresent)
                        {
                            // Modbus address is 1 less than what user entered.
                            // Eg: If user entered address 40001, the Modbus offset is 0.
                            ushort modbusOffset = (ushort)(item.Offset);

                            logger.Debug($"TCPReadHoldingRegisters Chunks:::: Offset:{modbusOffset} Length:{item.Length}");
                            logger.Debug($"Network Status Before Modbus Read Status:  {NetworkIsOk} master:{master.Transport.ToString()}");

                            try
                            {
                                master.ReadHoldingRegisters(slaveId, modbusOffset, item.Length).CopyTo(registers, index);
                                item.IsReadSuccess = true;
                                logger.Trace($"Chunk {item.Offset} Read Success");
                            }
                            catch (Exception exception)
                            {
                                // This Chunk Read failed. We will continue to read the remaining chunks
                                ModbusExceptions(exception, hostAddress, deviceName);
                                item.IsReadSuccess = false;
                                logger.Debug($"Chunk {item.Offset} Read Failed");
                            }

                        }
                        else
                        {
                            logger.Info($"Chunk {item.Offset} is not valid. So Skipping Modbus Read");
                        }


                        logger.Trace($"Index={ index}");
                        index += item.Length;

                    }
                    master.Dispose();
                    tcpClient.Close();
                }
                else
                {
                    registers = null;
                    logger.Debug($"Network Failure : Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                }
                logger.Debug("TCPReadHoldingRegisters Ended");
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception, hostAddress, deviceName);
                registers = null;
                return registers;
            }
        }

        public ushort[] TCPReadInputRegisters(string hostAddress, Int32 portNo, byte slaveId, ref List<ChunksModel> chunks, uint numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout, string deviceName)
        {
            ushort[] registers = new ushort[numRegisters];
            bool NetworkIsOk = false;
            try
            {
                logger.Debug("TCPReadInputRegisters Started");
                int index = 0;
                NetworkIsOk = connect(hostAddress, portNo, readTimeout, retryCount, waitToRetry, deviceTimeout, deviceName);

                if (NetworkIsOk)
                {
                    logger.Debug($"Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                    logger.Debug($"TCPReadInputRegisters startOffset:{chunks[0].Offset} TotalLength:{numRegisters}");
                    foreach (var item in chunks)
                    {
                        if (item.IsTagPresent)
                        {
                            // Modbus address is 1 less than what user entered.
                            // Eg: If user entered address 40001, the Modbus offset is 0.
                            ushort modbusOffset = (ushort)(item.Offset);

                            logger.Debug($"TCPReadInputRegisters Chunks:::: Offset:{modbusOffset} Length:{item.Length}");
                            try
                            {

                                master.ReadInputRegisters(slaveId, modbusOffset, item.Length).CopyTo(registers, index);
                                item.IsReadSuccess = true;
                                logger.Trace($"Chunk {item.Offset} Read Success");
                            }
                            catch (Exception exception)
                            {
                                // This Chunk Read failed. We will continue to read the remaining chunks
                                ModbusExceptions(exception, hostAddress, deviceName);
                                item.IsReadSuccess = false;
                                logger.Debug($"Chunk {item.Offset} Read Failed");
                            }
                        }
                        else
                        {
                            logger.Info($"Chunk {item.Offset} is not valid. So Skipping Modbus Read");
                        }

                        logger.Trace($"Index={ index}");
                        index += item.Length;

                    }
                    master.Dispose();
                    tcpClient.Close();
                }
                else
                {
                    registers = null;
                    logger.Debug($"Network Failure : Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                }

                logger.Debug("TCPReadInputRegisters Ended");
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception, hostAddress, deviceName);
                registers = null;
                return registers;
            }
        }

        public bool[] TCPReadInputs(string hostAddress, Int32 portNo, byte slaveId, ref List<ChunksModel> chunks, uint numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout, string deviceName)
        {
            bool[] registers = new bool[numRegisters];
            bool NetworkIsOk = false;
            try
            {
                logger.Debug("TCPReadInputs Started");
                int index = 0;
                NetworkIsOk = connect(hostAddress, portNo, readTimeout, retryCount, waitToRetry, deviceTimeout, deviceName);

                if (NetworkIsOk)
                {
                    logger.Debug($"Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                    logger.Debug($"TCPReadInputs startOffset:{chunks[0].Offset} TotalLength:{numRegisters}");
                    foreach (var item in chunks)
                    {
                        if (item.IsTagPresent)
                        {

                            // Modbus address is 1 less than what user entered.
                            // Eg: If user entered address 40001, the Modbus offset is 0.
                            ushort modbusOffset = (ushort)(item.Offset);


                            logger.Debug($"TCPReadInputs Chunks:::: Offset:{modbusOffset} Length:{item.Length}");
                            logger.Debug($"Network Status Before Modbus Read Status:  {NetworkIsOk} master:{master.Transport.ToString()}");
                            try
                            {
                                master.ReadInputs(slaveId, modbusOffset, item.Length).CopyTo(registers, index);
                                item.IsReadSuccess = true;
                                logger.Trace($"Chunk {item.Offset} Read Success");
                            }
                            catch (Exception exception)
                            {
                                // This Chunk Read failed. We will continue to read the remaining chunks
                                ModbusExceptions(exception, hostAddress, deviceName);
                                item.IsReadSuccess = false;
                                logger.Debug($"Chunk {item.Offset} Read Failed");
                            }

                        }
                        else
                        {
                            logger.Info($"Chunk {item.Offset} is not valid. So Skipping Modbus Read");
                        }

                        logger.Trace($"Index={ index}");
                        index += item.Length;

                    }
                    master.Dispose();
                    tcpClient.Close();
                }
                else
                {
                    registers = null;
                    logger.Debug($"Network Failure : Device Name:{deviceName} IPAddress:{hostAddress} Network Status:{NetworkIsOk}");
                }
                logger.Debug("TCPReadInputs Ended");
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception, hostAddress, deviceName);
                registers = null;
                return registers;
            }
        }

        #endregion TCP methods

        /// <summary>
        /// Method to find the Exception Type
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        private void ModbusExceptions(Exception exception, string IPAddress, string deviceName)
        {
            if (exception.Source.Equals("System"))
            {
                logger.Error(exception.Message);
                logger.Error($"**Modbus System** Device Name:{deviceName},IPAddres:{IPAddress}");
                logger.Error($"**Modbus System**{exception}");
            }
            //The server return error code.You can get the function code and exception code.
            if (exception.Source.Equals("NModbus4"))
            {
                try
                {
                    logger.Error($"**NModbus4** Device Name:{deviceName},IPAddres:{IPAddress}");
                    string str = exception.Message;
                    int FunctionCode;
                    string ExceptionCode;
                    str = str.Remove(0, str.IndexOf("\r\n") + 17);
                    FunctionCode = Convert.ToInt16(str.Remove(str.IndexOf("\r\n")));
                    logger.Error("Function Code: " + FunctionCode.ToString("X"));
                    str = str.Remove(0, str.IndexOf("\r\n") + 17);
                    ExceptionCode = str.Remove(str.IndexOf("-"));
                    switch (ExceptionCode.Trim())
                    {
                        case "1":
                            logger.Error("{0} || {1}  {2}", "Exception Code:", ExceptionCode.Trim(), "----> Illegal function!");
                            break;

                        case "2":
                            logger.Error("{0} || {1}  {2}", "Exception Code:", ExceptionCode.Trim(), "----> Illegal data address!");
                            break;

                        case "3":
                            logger.Error("{0} || {1}  {2}", "Exception Code:", ExceptionCode.Trim(), "----> Illegal data value!");
                            break;

                        case "4":
                            logger.Error("{0} || {1}  {2}", "Exception Code:", ExceptionCode.Trim(), "----> Slave device failure!");
                            break;
                    }
                }
                catch (Exception exce)
                {
                    logger.Error("{0} || {1}", "**Modbus Exception logic failed**", exce);
                }
            }
            logger.Error($"**Modbus Exception** Device Name:{deviceName},IPAddres:{IPAddress}");
            logger.Error("{0} || {1}", "**Modbus Exception**", exception);
        }

        private bool connect(string hostAddress, int portNo, int readTimeout, int retry, int waitToRetry, int deviceTimeout, string deviceName)
        {
            logger.Debug("connect started");
            bool returnValue;
            try
            {
                if (master != null)
                    master.Dispose();
                if (tcpClient != null)
                    tcpClient.Close();

                tcpClient = new TcpClient();
                logger.Debug($"Device IP:{hostAddress}, PortNo:{portNo}, ReadTimeout:{readTimeout}, Retry:{retry}, WaitToRetry:{waitToRetry}, DeviceTimeout:{deviceTimeout}");
                logger.Debug($"Device Name:{deviceName} Device IPAddress:{hostAddress}|| IsConnnected:{tcpClient.Connected}");
                if (tcpClient.Connected != true)
                {
                    IAsyncResult asyncResult = tcpClient.BeginConnect(hostAddress, portNo, null, null);
                    asyncResult.AsyncWaitHandle.WaitOne(deviceTimeout, true); //wait for time defined by deviceTimeout
                    if (!asyncResult.IsCompleted)
                    {
                        tcpClient.Close();
                        logger.Error("Cannot connect to device due to Device Timeout - {0}", hostAddress);
                        return false;
                    }
                }
                // create Modbus TCP Master by the tcpclient
                master = ModbusIpMaster.CreateIp(tcpClient);
                master.Transport.Retries = retry;
                master.Transport.ReadTimeout = readTimeout;
                master.Transport.WaitToRetryMilliseconds = waitToRetry;
                logger.Info("Connected to device - {0}", hostAddress);
                returnValue = true;
            }
            catch (System.Threading.ThreadAbortException tae)
            {
                logger.Error($"Threading related error {tae.ToString()}, hostAddress:{hostAddress}, portNo:{portNo},readTimeout:{readTimeout}, retry:{retry}, waitToRetry:{waitToRetry}, deviceTimeout:{deviceTimeout}");
                returnValue = false;
            }
            catch (Exception ex)
            {
                logger.Error($"{hostAddress}||{ex.ToString()}  or The Device does not support Modbus TCP/IP protocol, hostAddress:{hostAddress}, portNo:{portNo},readTimeout:{readTimeout}, retry:{retry}, waitToRetry:{waitToRetry}, deviceTimeout:{deviceTimeout}");
                returnValue = false;
            }
            logger.Debug("connect ended");
            return returnValue;
        }
        }
    }
