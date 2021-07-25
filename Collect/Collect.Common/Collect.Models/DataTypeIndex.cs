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
    public partial class ModbusTagDataType
    {
        public const int ModInteger16 = 0;
        public const int ModBool = 1;
        public const int ModFloat = 2;
        public const int ModSwappedFloat = 3;
        public const int ModDouble = 4;
        public const int ModInteger32 = 5;
        public const int ModSwappedDouble = 6;


        // Number of registers taken for each data type.
        // 1 Modbus register takes up 2 bytes (2 address spaces in case of bool) 
        private Dictionary<int, int> sizeTable = new Dictionary<int, int>()
                {
                    {ModInteger16,      1},
                    {ModBool,           1},
                    {ModFloat,          2},
                    {ModSwappedFloat,   2},
                    {ModInteger32,      2},
                    {ModDouble,         4},
                    {ModSwappedDouble,  4}
                };

    }

}
