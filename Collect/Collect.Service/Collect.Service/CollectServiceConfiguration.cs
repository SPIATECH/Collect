//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Utils.ConfigReadingCommon;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Common.Models;
using Common.Utils.Models;

namespace Collect.Service
{
    /// <summary>
    /// This class read all configration on application startup
    /// </summary>
    public class CollectServiceConfiguration
    {
        public String ConfigPath
        {
            get
            {
                return CollectServiceConstants.ConfigPath;
            }
        }

        public int ThreadSkipWarnCount { get; set; }
        public ushort ChunkSizeForBits { get; set; }
        public ushort ChunkSizeForWords { get; set; }
        public string BrokerUrl { get; set; }
        public string LogLevel { get; set; }
        public string DataSource { get; set; }
    }
}
