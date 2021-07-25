//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using Common.Models;
using Collect.ModbusWrapper.ModbusHelper;
using Common.Mqtt;
using Common.Utils.Models;

namespace Collect.ModbusWrapper
{
    public class CollectDeviceWrapper : ICollectServiceDeviceWrapper
    {
        #region Properties

        public ICollectServiceDevice DeviceModel { get; set; }

        public ushort[] holdingRegisters { get; set; }
        public ushort[] inputRegister { get; set; }
        public bool[] coils { get; set; }
        public bool[] inputs { get; set; }

        private readonly ChunksCreater chunksCreaterHolding;
        private readonly ChunksCreater chunksCreaterInputReg;
        private readonly ChunksCreater chunksCreaterCoil;
        private readonly ChunksCreater chunksCreaterInput;


        #endregion Properties

        #region Members

        public DateTime PollTime { get; set; }
        public DateTime HistoricalPollTime { get; set; }

        #endregion Members

        private readonly string exModubusRegisterType = "Enter a valid startingNumber";
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        public static string MQTTBrokerUrl;
        private readonly MessageWrapper messageWrapper = new MessageWrapper(MQTTBrokerUrl);
        private readonly ModbusWrapper modbusWrapper = new ModbusWrapper();

        /// <summary>
        /// This constructor is used when the calling class already has an object CollectModbusTcpDevice and the associated tags data 
        /// is available. Used when the data is fetched from CollectWebServer via mqtt.
        /// </summary>
        public CollectDeviceWrapper(CollectModbusTcpDevice collectModbusTcpDevice)
        {
            DeviceModel = collectModbusTcpDevice;

            // We need separate chunks creaters for each register type
            // Chunks will autamatically created inside
            chunksCreaterHolding = new ChunksCreater(ModbusRegisterType.HoldingRegister, DeviceModel.Tags);
            chunksCreaterInputReg = new ChunksCreater(ModbusRegisterType.InputRegister, DeviceModel.Tags);
            chunksCreaterCoil = new ChunksCreater(ModbusRegisterType.Coil, DeviceModel.Tags);
            chunksCreaterInput = new ChunksCreater(ModbusRegisterType.Input, DeviceModel.Tags);
        }

        /// <summary>
        /// 1. Call the function to read from different type of registers
        /// 2. Call the function to Assign register values in an array to a tag
        /// 3. Call the function to Write Tag values to InfluxDB
        /// </summary>
        public void UpdateTagValue(object isHistorical)
        {
            PollTime = DateTime.UtcNow;
            ReadHoldingRegisters();
            AssignTagValueFromHoldingRegisterArray();

            ReadCoils();
            AssignTagValueFromCoilArray();

            ReadInputRegisters();
            AssignTagValueFromInputRegisterArray();

            ReadInputs();
            AssignTagValueFromInputArray();

            SendData(PollTime, (bool)isHistorical);
        }

        /// <summary>
        /// Write each tag item to InfluxDB
        /// </summary>
        private void SendData(DateTime pt, bool isHistorical)
        {
            logger.Debug("Start.");
            try
            {
                foreach (var tagItems in DeviceModel.Tags)
                {
                    if (tagItems.Value != null)
                    {
                        var stopwatch = new Stopwatch();
                        stopwatch.Start();
                        logger.Debug($"Processing tag {tagItems.TagName}");

                        DataModel model = new DataModel()
                        {
                            device = DeviceModel.Name,
                            tagid = tagItems.TagId.ToString(),
                            tagname = tagItems.TagName,
                            timestamp = pt.DateTimeToUnixTimeSeconds(),
                            value = Convert.ToDecimal(tagItems.Value)
                        };
                        string parName = (tagItems as CollectModbusTcpTag).ParentFullName;
                        logger.Debug($"Parent Full Name: {parName}");

                        string[] groupNames = parName.Split('.').Reverse().ToArray();
                        logger.Debug($"groupNames count: {groupNames.Count()}");
                        SetGroupNames(groupNames, ref model);

                        string data = Serializer.JsonSerializer(model);

                        logger.Trace($"Data : {data}");

                        //Publish the values to MQTT broker for the TagProcessing module to update the database.
                        messageWrapper.PublishData(data, MqttCommonConstants.TagProcessingDataPublish);

                        stopwatch.Stop();
                        var timeForPublishData = stopwatch.Elapsed.TotalMilliseconds;
                        logger.Info($"timeForInsertData in (ms): {timeForPublishData}");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Write data failed**", ex);
            }
        }

        private void SetGroupNames(string[] names, ref DataModel dataModel)
        {
            logger.Debug("Start.");

            if (names.Length > 0)
            {
                dataModel.group = names[0];
            }
            if (names.Length > 1)
            {
                dataModel.parentgroup = names[1];
            }
            if (names.Length > 2)
            {
                dataModel.mastergroup = names[2];
            }

            logger.Debug("Completed.");
        }

        /// <summary>
        /// Write each tag item to Historical InfluxDB
        /// </summary>
        public void WriteHistoricalTSDB()
        {
            try
            {
                HistoricalPollTime = DateTime.UtcNow;
                foreach (var tagItems in DeviceModel.Tags)
                {
                    if (tagItems.Value != null)
                    {
                        var stopwatch = new Stopwatch();
                        stopwatch.Start();

                        //TODO:
                        //tsdb.InsertTSDB(tagItems, PollTime, true);

                        //logging the data to the log file temporarily
                        logger.Debug($"Value: {tagItems.Value}, Info: {tagItems.GetTagInfo()}");

                        stopwatch.Stop();
                        var timeForInsertTSDB = stopwatch.Elapsed.TotalMilliseconds;
                        logger.Info($"timeForInsertTSDB in (ms): {timeForInsertTSDB}");
                    }
                }
            }
            catch (Exception tsdbEx)
            {
                logger.Error("{0} || {1}", "**Write to Historian TSDB failed**", tsdbEx);
            }
        }

        #region TAG REGISTER TYPE

        public ModbusRegisterType GetRegisterTypeFromStartingNumber(int startingNumber)
        {
            switch (startingNumber)
            {
                case 0: return new ModbusRegisterType(ModbusRegisterType.Coil);
                case 1: return new ModbusRegisterType(ModbusRegisterType.Input);
                case 3: return new ModbusRegisterType(ModbusRegisterType.InputRegister);
                case 4: return new ModbusRegisterType(ModbusRegisterType.HoldingRegister);
                default: throw new ArgumentOutOfRangeException(exModubusRegisterType);
            }
        }

        #endregion TAG REGISTER TYPE

        /// <summary>
        /// To find the start offset and Length of a device. They are returned via reference parameters 
        /// </summary>
        /// <param name="startOffset"></param>
        /// <param name="endAddress"></param>
        /// <param name="registerLength"></param>
        /// <param name="registerType"></param>
        private void GetStartOffsetAndLength(ref ushort startOffset, ref uint registerLength, int registerType)
        {
            try
            {
                var firstTag = new CollectModbusTcpTag();
                var lastTag = new CollectModbusTcpTag();
                var ft = DeviceModel.Tags
                                .OrderBy(x => (x as CollectModbusTcpTag).Address)
                                .Where(y => (y as CollectModbusTcpTag)
                                .RegisterType.TypeIndex == registerType);
                if (ft.Count() != 0)
                {
                    firstTag = ft.First(y => (y as CollectModbusTcpTag).RegisterType.TypeIndex == registerType) as CollectModbusTcpTag;
                    lastTag = DeviceModel.Tags
                        .OrderBy(x => (x as CollectModbusTcpTag).Address)
                        .Last(y => (y as CollectModbusTcpTag).RegisterType.TypeIndex == registerType)
                        as CollectModbusTcpTag;
                }

                if (firstTag.Device != null)
                {
                    int lastTagRegCount = lastTag.DataType.GetRegCount();
                    logger.Debug($"lastTagAddress = {lastTag.Address}, lastTagRegCount = {lastTagRegCount}");
                    registerLength = (uint)((lastTag.Address - firstTag.Address + 1) + (lastTagRegCount - 1));

                    string fAddress = firstTag.Address.ToString();

                    // We need to extract the Offsset from the full address
                    // To get the offset, Remove the first digit from the Address. First Digit denotes Register type.
                    // For Coil it's tricky: In case of coil the first digit is 0. But that 0 will be lost since 
                    // we are storing the address as integer. So we have to handle Coil specially.
                    if (firstTag.RegisterType.TypeIndex == ModbusRegisterType.Coil)
                    {
                        // Coil Address Example : 012345
                        // In the Address field (which is an integer it will stored as 12345
                        // When converted to String it will be 12345
                        // Which is already the offset
                        startOffset = (ushort)(Convert.ToUInt32(fAddress) - 1);
                        logger.Trace($"Coil Type. So no need to remove anything. It's already the offset");
                    }
                    else
                    {
                        // Holding Register Address Example : 412345
                        // In the Address field (which is an integer it will stored as 412345
                        // When converted to String it will be 412345
                        // So Remove the first charactor (first digit) from the Address
                        startOffset = (ushort)(Convert.ToUInt32(fAddress.Substring(1)) - 1);
                        logger.Trace($"Not a Coil Type. So Need to remove the first digit to get the offset");

                    }

                    logger.Trace($"faddress = {fAddress}, startAddress = {startOffset}");
                }
            }
            catch (Exception calaculateEx)
            {
                logger.Error("{0} || {1}", "**GetStartOffsetAndLength**", calaculateEx);
            }
        }

        #region TAG DATATYPE

        /// <summary>
        /// Find the length of the last tag in order to find the total no. of registers to poll
        /// </summary>
        /// <param name="lastTag">
        /// The last tag of a device
        /// </param>
        /// <returns></returns>
        private int GetTagBasedIndexFromTag(CollectModbusTcpTag lastTag)
        {
            int tagBasedIndex;
            logger.Trace($"Started. Typeindex = {lastTag.DataType.TypeIndex}");
            switch (lastTag.DataType.TypeIndex)
            {
                case ModbusTagDataType.ModBool:
                case ModbusTagDataType.ModInteger16:
                    tagBasedIndex = 0;
                    break;
                case ModbusTagDataType.ModDouble:
                case ModbusTagDataType.ModSwappedDouble:
                    tagBasedIndex = 3;
                    break;
                case ModbusTagDataType.ModInteger32:
                case ModbusTagDataType.ModFloat:
                case ModbusTagDataType.ModSwappedFloat:
                    tagBasedIndex = 1;
                    break;
                default:
                    string ex = "That's not a valid TagDataType for Collect";
                    throw new ArgumentOutOfRangeException(ex);
            }
            logger.Trace($"Completed. TagbasedIndex = {tagBasedIndex}");
            return tagBasedIndex;
        }

        #endregion TAG DATATYPE

        /// <summary>
        /// Assign Holding register values to Tag
        /// </summary>
        public void AssignTagValueFromHoldingRegisterArray()
        {
            try
            {
                foreach (var tagModelInstance in DeviceModel.Tags
                        .OrderBy(x => (x as CollectModbusTcpTag).Address)
                        .Where(T => (T as CollectModbusTcpTag).RegisterType.TypeIndex == ModbusRegisterType.HoldingRegister))
                {
                    var tag = tagModelInstance as CollectModbusTcpTag;
                    dynamic temp = GetATagValueFromHoldingRegisterArray(tag);
                    if (temp != null)
                    {
                        tag.Value = Convert.ToDecimal(temp) * tag.MultiplicationFactor;
                    }
                    else
                    {
                        tag.Value = null;
                    }
                }
            }
            catch (Exception holdEx)
            {
                logger.Error("{0} || {1}", "**AssignTagValueFromHoldingRegisterArray**", holdEx);
            }
        }

        /// <summary>
        /// Assign Coil values to Tag
        /// </summary>
        private void AssignTagValueFromCoilArray()
        {
            try
            {
                foreach (var tag in DeviceModel.Tags
                    .OrderBy(x => (x as CollectModbusTcpTag).Address)
                    .Where(T => (T as CollectModbusTcpTag).RegisterType.TypeIndex == ModbusRegisterType.Coil))
                {
                    tag.Value = GetATagValueFromCoilArray(tag as CollectModbusTcpTag);
                }
            }
            catch (Exception coilEx)
            {
                logger.Error("{0} || {1}", "**AssignTagValueFromCoilArray**", coilEx);
            }
        }

        /// <summary>
        /// Assign Input register values to Tag
        /// </summary>
        private void AssignTagValueFromInputRegisterArray()
        {
            try
            {
                foreach (var tag in DeviceModel.Tags
                        .OrderBy(x => (x as CollectModbusTcpTag).Address)
                        .Where(T => (T as CollectModbusTcpTag).RegisterType.TypeIndex == ModbusRegisterType.InputRegister))
                {
                    var tagModelInstance = tag as CollectModbusTcpTag;
                    dynamic temp = GetATagValueFromInputRegisterArray(tagModelInstance);
                    if (temp != null)
                    {
                        tagModelInstance.Value = Convert.ToDecimal(temp) * tagModelInstance.MultiplicationFactor;
                    }
                    else
                    {
                        tagModelInstance.Value = null;
                    }
                }
            }
            catch (Exception inputRegEx)
            {
                logger.Error("{0} || {1}", "**AssignTagValueFromInputRegisterArray**", inputRegEx);
            }
        }

        /// <summary>
        /// Assign Input register values to Tag
        /// </summary>
        private void AssignTagValueFromInputArray()
        {
            try
            {
                foreach (var tag in DeviceModel.Tags
                    .OrderBy(x => (x as CollectModbusTcpTag).Address)
                    .Where(T => (T as CollectModbusTcpTag).RegisterType.TypeIndex == ModbusRegisterType.Input))
                {
                    tag.Value = GetATagValueFromInputArray(tag as CollectModbusTcpTag);
                }
            }
            catch (Exception inputEx)
            {
                logger.Error("{0} || {1}", "**AssignTagValueFromInputArray**", inputEx);
            }
        }

        /// <summary>
        ///  To find the first tag from a set of tags from ascending order of register address
        /// </summary>
        /// <param name="registerType"></param>
        /// <returns></returns>
        private CollectModbusTcpTag FirstTag(int registerTypeIndex)
        {
            try
            {
                var firstTag = DeviceModel.Tags.OrderBy(x => (x as CollectModbusTcpTag).Address)
                            .First(y => (y as CollectModbusTcpTag).RegisterType.TypeIndex == registerTypeIndex)
                            as CollectModbusTcpTag;
                Debug.Assert(firstTag != null, "firstTag should not be null");
                return firstTag;
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**FirstTag**", ex);
                return null;
            }
        }

        /// <summary>
        ///  Get tag value from any Register array (Holding or Input Register)
        /// </summary>
        /// <param name="registers"></param>
        /// <returns></returns>

        public dynamic GetTagvalueFromRegisterArray(ushort[] registers, int offset, int type, ChunksModel chunk)
        {
            dynamic value = null;
            if (chunk.IsTagPresent && chunk.IsReadSuccess)
            {
                logger.Debug($"Inside Debug {offset} type {type} reg[{offset}] {registers[offset]}");

                if (type == ModbusTagDataType.ModInteger16)
                {
                    value = registers[offset];
                }
                else if (type == ModbusTagDataType.ModFloat)
                {
                    value = Modbus.Utility.ModbusUtility.GetSingle(
                        registers[offset + 0],
                        registers[offset + 1]);
                }
                else if (type == ModbusTagDataType.ModSwappedFloat)
                {
                    value = Modbus.Utility.ModbusUtility.GetSingle(
                        registers[offset + 1],
                        registers[offset + 0]);
                }
                else if (type == ModbusTagDataType.ModInteger32)
                {
                    value = Modbus.Utility.ModbusUtility.GetUInt32(
                        registers[offset + 0],
                        registers[offset + 1]);
                }
                else if (type == ModbusTagDataType.ModDouble)
                {
                    value = Modbus.Utility.ModbusUtility.GetDouble(
                        registers[offset + 0],
                        registers[offset + 1],
                        registers[offset + 2],
                        registers[offset + 3]);
                }
                else if (type == ModbusTagDataType.ModSwappedDouble)
                {
                    value = Modbus.Utility.ModbusUtility.GetDouble(
                        registers[offset + 3],
                        registers[offset + 2],
                        registers[offset + 1],
                        registers[offset + 0]);
                }
            }
            return value;
        }
        /// <summary>
        ///  Get tag value from Holding Register array
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        public dynamic GetATagValueFromHoldingRegisterArray(CollectModbusTcpTag tag)
        {
            Debug.Assert(tag != null, "tag cannot be null");
            try
            {
                dynamic value = null;
                if (holdingRegisters != null)
                {
                    var FT = FirstTag(ModbusRegisterType.HoldingRegister);
                    int offset = tag.Address - Convert.ToInt32(FT.Address);
                    int type = tag.DataType.TypeIndex;
                    ChunksModel chunk = chunksCreaterHolding.GetChunk(offset);
                    logger.Trace($"offset {offset} type {type}");
                    value = GetTagvalueFromRegisterArray(holdingRegisters, offset, type, chunk);
                }

                return value;
            }
            catch (Exception getHoldEx)
            {
                logger.Error("{0} || {1}", "**GetATagValueFromHoldingRegisterArray**", getHoldEx);
                return null;
            }
        }

        /// <summary>
        ///  Get tag value from a coil array
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        private dynamic GetATagValueFromCoilArray(CollectModbusTcpTag tag)
        {
            Debug.Assert(tag != null, "tag should not be null");
            try
            {
                dynamic value = null;
                if (coils != null)
                {
                    var FT = FirstTag(ModbusRegisterType.Coil);
                    int offset = tag.Address - Convert.ToInt32(FT.Address);
                    ChunksModel chunk = chunksCreaterCoil.GetChunk(offset);
                    if (chunk.IsTagPresent && chunk.IsReadSuccess)
                    {
                        value = coils[offset];
                    }
                }
                return value;
            }
            catch (Exception getCoilEx)
            {
                logger.Error("{0} || {1}", "**GetATagValueFromCoilArray**", getCoilEx);
                return null;
            }
        }

        /// <summary>
        ///  Get tag value from an Input Register array
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        public dynamic GetATagValueFromInputRegisterArray(CollectModbusTcpTag tag)
        {
            Debug.Assert(tag != null, "tag cannot be null");
            try
            {
                dynamic value = null;
                if (inputRegister != null)
                {
                    var FT = FirstTag(ModbusRegisterType.InputRegister);
                    int offset = tag.Address - Convert.ToInt32(FT.Address);
                    int type = tag.DataType.TypeIndex;
                    ChunksModel chunk = chunksCreaterInputReg.GetChunk(offset);
                    logger.Debug($"Debug {offset} type {type}");
                    value = GetTagvalueFromRegisterArray(inputRegister, offset, type, chunk);
                }

                return value;
            }
            catch (Exception getHoldEx)
            {
                logger.Error("{0} || {1}", "**GetATagValueFromInputRegisterArray**", getHoldEx);
                return null;
            }
        }

        /// <summary>
        /// Get tag value from an Input array
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        private dynamic GetATagValueFromInputArray(CollectModbusTcpTag tag)
        {
            Debug.Assert(tag != null, "tag should not be null");
            try
            {
                dynamic value = null;
                if (inputs != null)
                {
                    var FT = FirstTag(ModbusRegisterType.Input);
                    int offset = tag.Address - Convert.ToInt32(FT.Address);
                    ChunksModel chunk = chunksCreaterInput.GetChunk(offset);
                    if (chunk.IsTagPresent && chunk.IsReadSuccess)
                    {
                        value = inputs[offset];
                    }
                }

                return value;
            }
            catch (Exception getInpEx)
            {
                logger.Error("{0} || {1}", "**GetATagValueFromInputArray**", getInpEx);
                return null;
            }
        }
        #region Methods to read from different type of registers

        /// <summary>
        /// Read data from Holding Registers
        /// </summary>
        public void ReadHoldingRegisters()
        {
            try
            {
                logger.Info("\nReadHoldingRegisters Started");
                var chunksCr = chunksCreaterHolding;

                ushort startOffset = chunksCr.startOffset;
                uint registerLengthToBeRead = chunksCr.registerLength;

                logger.Debug($"startOffset = {startOffset}, registerLength = {registerLengthToBeRead}");

                if (registerLengthToBeRead != 0)
                {
                    var tcpDevice = DeviceModel as CollectModbusTcpDevice;
                    holdingRegisters = modbusWrapper.TCPReadHoldingRegisters(
                                                                  tcpDevice.IPAddress,
                                                                  tcpDevice.Port,
                                                                  tcpDevice.SlaveID,
                                                                  ref chunksCr.chunksList,
                                                                  registerLengthToBeRead,
                                                                  tcpDevice.RetryCount,
                                                                  tcpDevice.ReadTimeout,
                                                                  tcpDevice.WaitToRetry,
                                                                  tcpDevice.DeviceTimeout,
                                                                  tcpDevice.Name);
                }
            }
            catch (Exception rhEx)
            {
                logger.Error("{0} || {1}", "**ReadHoldingRegisters**", rhEx);
            }
        }

        /// <summary>
        /// Read data from Coils
        /// </summary>
        public void ReadCoils()
        {
            try
            {
                logger.Info("ReadCoils Started");
                var chunksCr = chunksCreaterCoil;

                ushort startOffset = chunksCr.startOffset;
                uint registerLengthToBeRead = chunksCr.registerLength;
                logger.Debug($"startOffset = {startOffset}, registerLength = {registerLengthToBeRead}");

                if (registerLengthToBeRead != 0)
                {

                    var tcpDevice = DeviceModel as CollectModbusTcpDevice;
                    coils = modbusWrapper.TCPReadCoils(
                                            tcpDevice.IPAddress,
                                            tcpDevice.Port,
                                            tcpDevice.SlaveID,
                                            ref chunksCr.chunksList,
                                            registerLengthToBeRead,
                                            tcpDevice.RetryCount,
                                            tcpDevice.ReadTimeout,
                                            tcpDevice.WaitToRetry,
                                            tcpDevice.DeviceTimeout,
                                            tcpDevice.Name);
                }
            }
            catch (Exception rcEx)
            {
                logger.Error("{0} || {1}", "**ReadCoils**", rcEx);
            }
        }

        /// <summary>
        /// Read data from Input Registers
        /// </summary>
        public void ReadInputRegisters()
        {
            try
            {
                logger.Info("ReadInputRegisters Started");
                var chunksCr = chunksCreaterInputReg;

                ushort startOffset = chunksCr.startOffset;
                uint registerLengthToBeRead = chunksCr.registerLength;
                logger.Debug($"startOffset = {startOffset}, registerLength = {registerLengthToBeRead}");

                if (registerLengthToBeRead != 0)
                {
                    var tcpDevice = DeviceModel as CollectModbusTcpDevice;
                    inputRegister = modbusWrapper.TCPReadInputRegisters(
                                                            tcpDevice.IPAddress,
                                                            tcpDevice.Port,
                                                            tcpDevice.SlaveID,
                                                            ref chunksCr.chunksList,
                                                            registerLengthToBeRead,
                                                            tcpDevice.RetryCount,
                                                            tcpDevice.ReadTimeout,
                                                            tcpDevice.WaitToRetry,
                                                            tcpDevice.DeviceTimeout,
                                                            tcpDevice.Name);
                }
            }
            catch (Exception riREx)
            {
                logger.Error("{0} || {1}", "**ReadInputRegisters**", riREx);
            }
        }

        /// <summary>
        /// Read data from Inputs
        /// </summary>
        public void ReadInputs()
        {
            try
            {
                logger.Info("ReadInput Started");
                var chunksCr = chunksCreaterInput;

                ushort startOffset = chunksCr.startOffset;
                uint registerLengthToBeRead = chunksCr.registerLength;
                if (registerLengthToBeRead != 0)
                {

                    var tcpDevice = DeviceModel as CollectModbusTcpDevice;
                    inputs = modbusWrapper.TCPReadInputs(
                                              tcpDevice.IPAddress,
                                              tcpDevice.Port,
                                              tcpDevice.SlaveID,
                                              ref chunksCr.chunksList,
                                              registerLengthToBeRead,
                                              tcpDevice.RetryCount,
                                              tcpDevice.ReadTimeout,
                                              tcpDevice.WaitToRetry,
                                              tcpDevice.DeviceTimeout,
                                              tcpDevice.Name);
                }
            }
            catch (Exception riEx)
            {
                logger.Error("{0} || {1}", "**ReadInputs**", riEx);
            }
        }

        #endregion Methods to read from different type of registers
    }
}