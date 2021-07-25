//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Text;

namespace Collect.Models
{
    public class DataModel
    {
        //"tagname"
        public string tagname { get; set; }

        //"value"
        public decimal value { get; set; }

        //"timestamp"
        public long timestamp { get; set; }

        //"device"
        public string device { get; set; }

        //"tagid"
        public string tagid { get; set; }

        //"group"
        public string group { get; set; }

        //"parentgroup"
        public string parentgroup { get; set; }

        //"mastergroup"
        public string mastergroup { get; set; }
    }
}
