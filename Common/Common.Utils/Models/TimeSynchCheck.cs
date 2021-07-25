//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Common.Utils.Models
{

    public class TimeRequestModel
    {
        public long ClientTime { get; set; }

        public long ServerTime { get; set; }

        public int ServerOffset { get; set; }

    }

    class TimeSynchCheck
    {

    }
}
