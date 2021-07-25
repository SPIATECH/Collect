//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Utils.DataType
{
    /// <summary>
    /// This class can be used like an enum. 
    /// The purpose of this class is like this, various functionality like configuration reading can be provided here.
    /// Based on following
    /// https://stackoverflow.com/a/424414/3001007
    /// http://www.javacamp.org/designPattern/enum.html
    /// </summary>
    public abstract class TypeSafeEnum
    {
        private readonly String name;
        private readonly int value;

        protected TypeSafeEnum(int value, String name)
        {
            this.name = name;
            this.value = value;
        }

        public override String ToString()
        {
            return name;
        }
    }
}
