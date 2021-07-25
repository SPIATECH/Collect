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
    public class ChunksModel
    {
        // This will carry Register Offset & Length (Not full Modbus Address)
        public ushort Offset { get; set; }
        public ushort Length { get; set; }

        // This denotes if any tag is present for this particular Chunk.
        // This can happen when the tags in a device are far apart in address.
        // This is set while creating chunks at the time of initialiation - before reading. The Modbus Read layer
        // uses this flag to decide whether this chunk need to read or skipped. 
        // Default Value is false
        public bool IsTagPresent { get; set; }

        // This is a feedback from the lower layer of Modbus reading.
        // Denotes whether reading of this chunk was successful or not. default value is false. 
        // If read failed, the tags corresponding to this chunk will not be updated. 
        public bool IsReadSuccess { get; set; }
    }
}
