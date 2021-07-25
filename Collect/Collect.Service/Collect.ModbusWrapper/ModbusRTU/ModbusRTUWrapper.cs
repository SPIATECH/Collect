//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Modbus.Device;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;

namespace Collect.ModbusWrapper
{
    /// <summary>
    /// Modbus RTU Wrapper Class
    /// </summary>
    public class ModbusRtuWrapper
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        private ModbusSerialMaster master;

        public bool NetworkIsOk { get; set; }

        #region RTU Methods

        /// <summary>
        /// Method to read from Coil
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="slaveId"></param>
        /// <param name="startAddress"></param>
        /// <param name="numRegisters"></param>
        /// <param name="retryCount"></param>
        /// <param name="readTimeout"></param>
        /// <param name="waitToRetry"></param>
        /// <param name="deviceTimeout"></param>
        /// <returns></returns>
        public bool[] RTUReadCoils(SerialPort sp, byte slaveId, ushort startAddress, ushort numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout)
        {
            bool[] registers = null;
            try
            {
                NetworkIsOk = false;
                NetworkIsOk = Connect(sp, readTimeout, retryCount, waitToRetry);
                if (NetworkIsOk)
                {
                    registers = master.ReadCoils(slaveId, startAddress, numRegisters);
                    master.Dispose();
                    sp.Close();
                }
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception);
                registers = null;
                return registers;
            }
        }

        /// <summary>
        /// Method to read from Holding Register
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="slaveId"></param>
        /// <param name="startAddress"></param>
        /// <param name="numRegisters"></param>
        /// <param name="retryCount"></param>
        /// <param name="readTimeout"></param>
        /// <param name="waitToRetry"></param>
        /// <param name="deviceTimeout"></param>
        /// <returns></returns>
        public ushort[] RTUReadHoldingRegisters(SerialPort sp, byte slaveId, ushort startAddress, ushort numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout)
        {
            ushort[] registers = null;
            try
            {
                NetworkIsOk = false;
                NetworkIsOk = Connect(sp, readTimeout, retryCount, waitToRetry);
                if (NetworkIsOk)
                {
                    registers = master.ReadHoldingRegisters(slaveId, startAddress, numRegisters);
                    master.Dispose();
                    sp.Close();
                }
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception);
                registers = null;
                return registers;
            }
        }

        /// <summary>
        /// Method to read from Input Register
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="slaveId"></param>
        /// <param name="startAddress"></param>
        /// <param name="numRegisters"></param>
        /// <param name="retryCount"></param>
        /// <param name="readTimeout"></param>
        /// <param name="waitToRetry"></param>
        /// <param name="deviceTimeout"></param>
        /// <returns></returns>
        public ushort[] RTUReadInputRegisters(SerialPort sp, byte slaveId, ushort startAddress, ushort numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout)
        {
            ushort[] registers = null;
            try
            {
                NetworkIsOk = false;
                NetworkIsOk = Connect(sp, readTimeout, retryCount, waitToRetry);
                if (NetworkIsOk)
                {
                    registers = master.ReadInputRegisters(slaveId, startAddress, numRegisters);
                    master.Dispose();
                    sp.Close();
                }
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception);
                registers = null;
                return registers;
            }
        }

        /// <summary>
        /// Method to read from Input
        /// </summary>
        /// <param name="sp"></param>
        /// <param name="slaveId"></param>
        /// <param name="startAddress"></param>
        /// <param name="numRegisters"></param>
        /// <param name="retryCount"></param>
        /// <param name="readTimeout"></param>
        /// <param name="waitToRetry"></param>
        /// <param name="deviceTimeout"></param>
        /// <returns></returns>
        public bool[] RTUReadInputs(SerialPort sp, byte slaveId, ushort startAddress, ushort numRegisters, int retryCount, int readTimeout, int waitToRetry, int deviceTimeout)
        {
            bool[] registers = null;
            try
            {
                NetworkIsOk = false;
                NetworkIsOk = Connect(sp, readTimeout, retryCount, waitToRetry);
                if (NetworkIsOk)
                {
                    registers = master.ReadInputs(slaveId, startAddress, numRegisters);
                    master.Dispose();
                    sp.Close();
                }
                return registers;
            }
            catch (Exception exception)
            {
                ModbusExceptions(exception);
                registers = null;
                return registers;
            }
        }

        #endregion RTU Methods

        #region Serial Connect Method

        /// <summary>
        /// Serial port Connection Method
        /// </summary>
        /// <param name="serialPort"></param>
        /// <param name="readTimeout"></param>
        /// <param name="retryCount"></param>
        /// <param name="waitToRetry"></param>
        /// <param name="deviceTimeout"></param>
        /// <returns></returns>
        private bool Connect(SerialPort serialPort, int readTimeout, int retryCount, int waitToRetry)
        {
            try
            {
                serialPort.Open();
                master = ModbusSerialMaster.CreateRtu(serialPort);
                master.Transport.Retries = retryCount;
                master.Transport.ReadTimeout = readTimeout;
                master.Transport.WaitToRetryMilliseconds = waitToRetry;
                return true;
            }
            catch (Exception ex)
            {
                serialPort.Close();
                logger.Error(ex);
                return false;
            }
        }

        #endregion Serial Connect Method

        #region Modbus Exception Method

        /// <summary>
        /// Modbus Exception Handling method
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        private void ModbusExceptions(Exception exception)
        {
            if (exception.Source.Equals("System"))
            {
                logger.Error(exception.Message);
                logger.Error("{0} || {1} || {2}", "**Modbus System**", DateTime.Now, exception);
                return;
            }
            //The server return error code.You can get the function code and exception code.
            if (exception.Source.Equals("NModbus4"))
            {
                try
                {
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
                        default:
                            logger.Fatal($"Unknown value = {ExceptionCode.Trim()}");
                            break;
                    }
                    return;
                }
                catch (Exception exce)
                {
                    logger.Error("{0} || {1}", "**Modbus Exception logic failed**", exce);
                }
            }
            logger.Error("{0} || {1}", "**Modbus Exception**", exception);
            return;
        }

        #endregion Modbus Exception Method
    }
}
