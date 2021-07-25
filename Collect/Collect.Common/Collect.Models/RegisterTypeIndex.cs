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
    public partial class ModbusRegisterType
    {
        public const int Coil = 0;
        public const int Input = 1;
        public const int InputRegister = 3;
        public const int HoldingRegister = 4;
    }
}
