//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Models;

namespace Collect.ModbusWrapper.ModbusHelper
{
    public class ChunksCreater
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        // Whether this is for Holding OR Coil OR etc etc
        private int _registerType;
        // Chunk size can vary for each register type
        private ushort _chunkSize;
        // Reference to the Tags. This is needed for creating chunks and Marking validity.
        List<ICollectServiceTag> _tags;

        // Initialised at the startup of collect service. 
        public static ushort ChunkSizeForBits;
        public static ushort ChunkSizeForWords;

        private Dictionary<int, ushort> _ChunkSizeTable = new Dictionary<int, ushort>
        {
            {ModbusRegisterType.Coil,             ChunkSizeForBits},
            {ModbusRegisterType.HoldingRegister,  ChunkSizeForWords},
            {ModbusRegisterType.Input,            ChunkSizeForBits},
            {ModbusRegisterType.InputRegister,    ChunkSizeForWords}
        };
        // Chunks list. This is where all chunks will exist. 
        public List<ChunksModel> chunksList;
        // Start Off set of whole register range
        public ushort startOffset { get; set; }
        // Length of the registers to read
        public uint registerLength { get; set; }


        public ChunksCreater(int registerType, List<ICollectServiceTag> tags)
        {
            // Initialise all private variables
            _registerType = registerType;
            _chunkSize = _ChunkSizeTable[registerType];
            _tags = tags;

            // Create Chunks based on the above set information 
            CreateChunks();
        }

        private ushort GetChunkOffset(int Offset)
        {
            return (ushort)(Offset / _chunkSize);
        }

        public ChunksModel GetChunk(int Offset)
        {
            return chunksList[GetChunkOffset(Offset)];
        }

        public int CreateChunks()
        {
            // Calculate some basic information about the Tags
            GetStartOffsetAndLength();
            if (registerLength != 0)
            {
                logger.Info($" Creating Chunks, Chunk Size {_chunkSize}");
                chunksList = CreateChunksHelper(_chunkSize);
                if (chunksList == null)
                {
                    logger.Fatal("Chunks Creation failed");
                    return -1;
                }

                // This will mark each chunks in this chunkList as valid or not
                // This will go through each tags and set the corresponding chunkset
                logger.Info("Doing Setting of Tags Present Flag");
                MarkIsTagPresent();
            }
            return 0;
        }

        private List<ChunksModel> CreateChunksHelper(ushort chunkSize)
        {
            List<ChunksModel> chunks = new List<ChunksModel>();
            try
            {
                logger.Debug("Create Chunks Started\n");
                ushort chunkOffset;
                int padding = 5;
                //Do a -1 is for getting the correct length.
                uint endOffset = startOffset + registerLength - 1;
                logger.Debug($"Start Offset : {startOffset.ToString().PadLeft(padding,'0')}");
                logger.Debug($"End Offset   : {endOffset.ToString().PadLeft(padding, '0')}");
                logger.Debug($"Total Length : {registerLength.ToString().PadLeft(padding)}");
                logger.Debug($"Chunk Size   : {chunkSize.ToString().PadLeft(padding)}\n");

                // It's important to do a validation here
                if (endOffset > CollectCommonConstants.modbusAddressMax)
                {
                    logger.Fatal($"End offset ({endOffset}) is invalid");
                    throw (new Exception());
                }

                //Loop for creating complete chunks based on Chunk size
                chunkOffset = startOffset;
                while (endOffset - chunkOffset + 1 >= chunkSize)
                {
                    ChunksModel chunk = new ChunksModel();
                    chunk.Offset = chunkOffset;
                    chunk.Length = chunkSize;
                    chunk.IsTagPresent = false;
                    logger.Debug($"Offset: {chunk.Offset} Length:{ chunk.Length}");
                    chunks.Add(chunk);
                    chunkOffset += chunkSize;
                }
                //Condition for getting rest of addresses which is the remaining partial chunk.
                //This will be lesser than the chunk size.
                if (endOffset - chunkOffset + 1 > 0)
                {
                    ChunksModel chunk = new ChunksModel();
                    chunk.Offset = chunkOffset;
                    chunk.Length = Convert.ToUInt16(endOffset - chunkOffset + 1);
                    chunk.IsTagPresent = false;
                    logger.Debug($"Offset: {chunk.Offset} Length: {chunk.Length}");
                    chunks.Add(chunk);
                }
                logger.Debug("Create Chunks Completed");
                logger.Debug($"No. of chunks: {chunks.Count}");
                return chunks;
            }
            catch (Exception ex)
            {
                logger.Error("Create chunks failed" + ex);
                return chunks;
            }
        }


        public int MarkIsTagPresent()
        {
            logger.Info("Started Marking chunks IsTagPresent");
            // Find out the first address of this Register Type. first addres is needed for
            // calcuating of the offset of any tag.
            var firstTag = _tags.OrderBy(x => (x as CollectModbusTcpTag).Address)
                        .First(y => (y as CollectModbusTcpTag).RegisterType.TypeIndex == _registerType)
                        as CollectModbusTcpTag;
            int firstAddress = firstTag.Address;

            // Go through each Tags and set the flag
            foreach (var item in _tags.Where(x => (x as CollectModbusTcpTag)?.RegisterType.TypeIndex == _registerType))
            {

                CollectModbusTcpTag tag = item as CollectModbusTcpTag;
                int offset = Convert.ToInt32(tag.Address - firstAddress);
                logger.Debug($"Setting IsTagPresent = true for offset = {offset}");
                // Mark the Flag, so that lower layer will read this chunk.
                GetChunk(offset).IsTagPresent = true;

                // If Tag Dataype is bigger than 1 register. Then there is a chance that 
                // this tag is spread to the next chunk also. Below code is to handle that 
                // boundry condition. Remdine Bug : 1204
                int regCount = tag.DataType.GetRegCount();
                int endOffset = offset + regCount - 1;
                // Mark the Flag, for the end offset too
                logger.Debug($"Setting IsTagPresent = true for endoffset = {endOffset}");
                GetChunk(endOffset).IsTagPresent = true;
            }

            return 0;
        }


        private void GetStartOffsetAndLength()
        {
            try
            {
                var firstTag = new CollectModbusTcpTag();
                var lastTag = new CollectModbusTcpTag();
                var ft = _tags
                                .OrderBy(x => (x as CollectModbusTcpTag).Address)
                                .Where(y => (y as CollectModbusTcpTag)
                                .RegisterType.TypeIndex == _registerType);
                if (ft.Count() != 0)
                {
                    firstTag = ft.First(y => (y as CollectModbusTcpTag).RegisterType.TypeIndex == _registerType) as CollectModbusTcpTag;
                    lastTag = _tags
                        .OrderBy(x => (x as CollectModbusTcpTag).Address)
                        .Last(y => (y as CollectModbusTcpTag).RegisterType.TypeIndex == _registerType)
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


    }
}
