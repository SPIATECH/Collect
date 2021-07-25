//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


//using Collect.DataAccess.TSDB;
using Collect.Models;
using Common.Models;
using Newtonsoft.Json.Linq;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading;

namespace Collect.ModbusWrapper
{
    /// <summary>
    /// This is actually CollectTCPDeviceManager.
    /// </summary>
    public class CollectTcpDeviceManager : ICollectServiceDeviceManager
    {
        public List<Thread> Threads { get; set; }

        /// <summary>
        /// List of Tuple[DeviceId, skipCount]
        /// </summary>
        internal Dictionary<Guid, int> threadSkipDict { get; set; }

        internal int threadSkipWarnCount { get; set; }
        private System.Timers.Timer refreshTimer { get; set; }
        public List<ICollectServiceDeviceWrapper> Devices { get; set; }
        public string TsdbConString { get; set; }
        public string TsdbUsername { get; set; }
        public string TsdbPassword { get; set; }
        public string AllDevicesAndTagsJson { get; set; }

        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        public static int CountNeeded;
        public static string Connection;
        public static string UserName;
        public static string Password;
        public static string RealTimeRP_Hour;
        public static string RealTimeRP_Minute;
        public static string RealTimeRP_Second;
        public static string HistoricalRP_Hour;
        public static string HistoricalRP_Minute;
        public static string HistoricalRP_Second;
        public static string DataSource;
        public CollectTcpDeviceManager()
        {

            TsdbConString = Connection;
            TsdbUsername = UserName;
            TsdbPassword = Password;
            threadSkipWarnCount = CountNeeded;

            threadSkipDict = new Dictionary<Guid, int>();

            InitilizeTSDB();
            GetListofDevices();
        }

        private void InitilizeTSDB()
        {
            try
            {
                //var task = new CollectTsdbInit(TsdbConString, TsdbUsername, TsdbPassword, RealTimeRP_Hour,
                //                              RealTimeRP_Minute, RealTimeRP_Second, HistoricalRP_Hour, HistoricalRP_Minute, HistoricalRP_Second).initTSDB();
                //logger.Debug("TSDB Write Status=" + task.Status);
                logger.Info("**Initialize TSDB**");
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Initialize TSDB Failed**", ex);
            }
        }

        /// <summary>
        /// Get device details and put it in a list
        /// </summary>
        public void GetListofDevices()
        {
            logger.Debug("GetListofDevices start");
            try
            {
                List<CollectModbusTcpDevice> deviceModelList = new List<CollectModbusTcpDevice>();
                Devices = new List<ICollectServiceDeviceWrapper>();

                deviceModelList = PopulateDevicesAndTags();
                Devices = deviceModelList.Select(dev => new CollectDeviceWrapper(dev)).ToList<ICollectServiceDeviceWrapper>();
                logger.Info($"Datasource is mqtt message. deviceModelList.count = {deviceModelList.Count}.");

                logger.Debug($"CollectTCPDevices (Count: {Devices.Count} updated.");
                Threads = new List<Thread>();
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Get list of devices Failed**", ex);
            }
            logger.Debug("GetListofDevices start");
        }

        public List<CollectModbusTcpDevice> PopulateDevicesAndTags()
        {
            List<CollectModbusTcpDevice> deviceList = new List<CollectModbusTcpDevice>();
            try
            {
                if (!string.IsNullOrEmpty(AllDevicesAndTagsJson))
                {
                    JArray arr = JArray.Parse(AllDevicesAndTagsJson);
                    logger.Debug(arr);
                    var modbusDevices = arr.Where(x => x[CollectCommonConstants.JTagName_deviceid].ToString() ==
                            CollectCommonConstants.ModTCP_DevcieTypeName).First()[CollectCommonConstants.JTagName_devices];
                    foreach (var device in modbusDevices)
                    {
                        CollectModbusTcpDevice tcpDev = new CollectModbusTcpDevice();
                        tcpDev.Tags = new List<ICollectServiceTag>();

                        tcpDev.DeviceId = Guid.Parse(device[CollectCommonConstants.JTagName_deviceid].ToString());
                        tcpDev.IPAddress = device[CollectCommonConstants.JTagName_ipaddress].ToString();
                        tcpDev.SlaveID = Convert.ToByte(device[CollectCommonConstants.JTagName_slaveid]);
                        tcpDev.Port = Convert.ToInt32(device[CollectCommonConstants.JTagName_port]);
                        tcpDev.Name = device[CollectCommonConstants.JTagName_devicename].ToString();
                        tcpDev.DeviceType = device[CollectCommonConstants.JTagName_deviceTypeId].ToString();
                        tcpDev.ReadTimeout = Convert.ToInt32(device[CollectCommonConstants.JTagName_readtimeout]);
                        tcpDev.WaitToRetry = Convert.ToInt32(device[CollectCommonConstants.JTagName_waittoretry]);
                        tcpDev.DeviceTimeout = Convert.ToInt32(device[CollectCommonConstants.JTagName_devicetimeout]);
                        tcpDev.RetryCount = Convert.ToInt32(device[CollectCommonConstants.JTagName_retrycount]);
                        logger.Debug("===============================");
                        logger.Debug($"\n DeviceID = {tcpDev.DeviceId}\n IPAddress = {tcpDev.IPAddress}\n SlaveID={tcpDev.SlaveID}\n Port={tcpDev.Port}" +
                            $"\n DeviceName={tcpDev.Name}\n DeviceType={tcpDev.DeviceType}\n ReadTimeout={tcpDev.ReadTimeout}\n WaitToRetry={tcpDev.WaitToRetry}" +
                            $"\n DeviceTimeout={tcpDev.DeviceTimeout}\n Retry Count={tcpDev.RetryCount}");
                        logger.Debug("===============================");

                        JArray tags = (JArray)device[CollectCommonConstants.JTagName_tags];
                        foreach (var tag in tags)
                        {
                            CollectModbusTcpTag t = new CollectModbusTcpTag()
                            {
                                RegisterType = GetRegisterType(tag[CollectCommonConstants.JTagName_registertype].ToString()),
                                Address = GetAddress(GetRegisterType(tag[CollectCommonConstants.JTagName_registertype].ToString()),
                                                                            Convert.ToInt32(tag[CollectCommonConstants.JTagName_offset])),
                                DataType = GetDatatype(tag[CollectCommonConstants.JTagName_datatype].ToString()),
                                TagId = Guid.Parse(tag[CollectCommonConstants.JTagName_TagId].ToString()),
                                TagName = tag[CollectCommonConstants.JTagName_tagname].ToString(),
                                //TODO: This should be assigned from the message.
                                MultiplicationFactor = 1,
                                ParentFullName = tag[CollectCommonConstants.JTagName_ParentFullName].ToString(),
                                Device = tcpDev
                            };

                            logger.Debug("===============================");
                            logger.Debug($"\n TagID= {t.TagId}\n TagName= {t.TagName}\n RegisterType={t.RegisterType.DisplayName}\n Address={t.Address}\n DataType={t.DataType.DisplayName}" +
                                $"\n MultiplicationFactor={t.MultiplicationFactor}");
                            logger.Debug("===============================");
                            tcpDev.Tags.Add(t);
                        }
                        deviceList.Add(tcpDev);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error($"Error occured while converting json to tag data object {ex}");
            }
            return deviceList;
        }

        private ModbusTagDataType GetDatatype(string datatype)
        {
            switch (datatype)
            {
                case CollectCommonConstants.ModTCPDataType_Int16: return new ModbusTagDataType(ModbusTagDataType.ModInteger16);
                case CollectCommonConstants.ModTCPDataType_Int32: return new ModbusTagDataType(ModbusTagDataType.ModInteger32);
                case CollectCommonConstants.ModTCPDataType_Float: return new ModbusTagDataType(ModbusTagDataType.ModFloat);
                case CollectCommonConstants.ModTCPDataType_Double: return new ModbusTagDataType(ModbusTagDataType.ModDouble);
                case CollectCommonConstants.ModTCPDataType_Bool: return new ModbusTagDataType(ModbusTagDataType.ModBool);
                default: throw new ArgumentOutOfRangeException(CollectServiceConstants.exMessage_DataType);
            }
        }

        private int GetAddress(ModbusRegisterType modbusRegisterType, int offset)
        {
            int baseAddress = modbusRegisterType.TypeIndex * CollectCommonConstants.BaseAddressMulFactor;
            int address = baseAddress + offset;
            logger.Debug($"Address = {address}");
            return address;
        }

        private ModbusRegisterType GetRegisterType(string txt_regType)
        {
            switch (txt_regType)
            {
                case CollectCommonConstants.ModTCPRegType_Coil: return new ModbusRegisterType(ModbusRegisterType.Coil);
                case CollectCommonConstants.ModTCPRegType_Input: return new ModbusRegisterType(ModbusRegisterType.Input);
                case CollectCommonConstants.ModTCPRegType_InputRegister: return new ModbusRegisterType(ModbusRegisterType.InputRegister);
                case CollectCommonConstants.ModTCPRegType_HoldingRegister: return new ModbusRegisterType(ModbusRegisterType.HoldingRegister);
                default: throw new ArgumentOutOfRangeException(CollectServiceConstants.exMessage_RegisterType);
            }
        }

        /// <summary>
        /// Run threads for each devices
        /// </summary>
        public void UpdateAllDeviceTags(bool isHistorical)
        {
            try
            {
                logger.Debug("UpdateAllDeviceTags method started");
                int noOfThreads = Process.GetCurrentProcess().Threads.Count;
                logger.Debug($"Number of threads running is: {noOfThreads}");

                // Remove all finished threads
                List<Guid> listOfRunningThreads = Threads.Where(t => t.IsAlive).Select(x => Guid.Parse(x.Name)).ToList();
                List<Guid> listOfNotRunningThreads = Threads.Where(t => !t.IsAlive).Select(x => Guid.Parse(x.Name)).ToList();
                // Since these are not running, those wont be skipped
                foreach (var item in listOfNotRunningThreads)
                {
                    threadSkipDict.Remove(item);
                }
                // Loop for logging skipped threads
                foreach (var sk in listOfRunningThreads)
                {
                    int existingCount = 0;
                    threadSkipDict.TryGetValue(sk, out existingCount);
                    int newCount = existingCount + 1;
                    threadSkipDict[sk] = newCount;
                    var theDevAboutTobeSkipped = Devices.FirstOrDefault(x => x.DeviceModel.DeviceId == sk);
                    var theDevAboutTobeSkipped2 = (theDevAboutTobeSkipped == null) ? null : theDevAboutTobeSkipped.DeviceModel;
                    string devDetails = CollectSerializer.Serializer(theDevAboutTobeSkipped2);
                    if (threadSkipWarnCount > 0 && newCount > threadSkipWarnCount)
                    {
                        logger.Error($@"
=========================================
=========================================
=========================================
This device thread skipped for too many times (Skipped:{newCount}).
DeviceId:{sk.ToString()}
Details: {devDetails}
=========================================
=========================================
=========================================
");
                    }
                    else
                    {
                        logger.Warn($@"
=========================================
This device will be skipped since a thread is alrady running.
DeviceId:{sk.ToString()}
Details: {devDetails}
SkippedOfCount: {newCount}
=========================================
");
                    }
                }
                // Since these are not running, those should be removed. New threads are added later
                Threads.RemoveAll(t => !t.IsAlive);

                //Initilizing new thread for each device

                for (int i = 0; i < Devices.Count; i++)
                {
                    // Create new threads if corresponding threads not present

                    var theDevice = Devices[i];
                    var theDeviceId = theDevice.DeviceModel.DeviceId;
                    if (!listOfRunningThreads.Contains(theDeviceId))
                    {
                        var newThread = new Thread(new ParameterizedThreadStart(Devices[i].UpdateTagValue));
                        newThread.Name = theDeviceId.ToString();
                        Threads.Add(newThread);
                    }
                }

                foreach (Thread thread in Threads)
                {
                    if (!thread.IsAlive)
                        thread.Start(isHistorical);
                }
                logger.Info("**UpdateAllDeviceTags Completed**");
            }
            catch (ThreadStateException te)
            {
                logger.Error("{0} || {1}", "**Thread Exception**", te);
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**UpdateAllDeviceTags Failed**", ex);
            }
        }

        /// <summary>
        /// Run threads for each devices for Historical TSDB Write
        /// </summary>
        public void updateHistoricalTSDb()
        {
            try
            {
                foreach (var dev in Devices)
                {
                    new Thread(new ThreadStart(dev.WriteHistoricalTSDB)).Start();
                }
            }
            catch (Exception es)
            {
                logger.Error("{0} || {1}", "**WriteHistoricalTSDB failed**", es);
            }
        }
    }
}