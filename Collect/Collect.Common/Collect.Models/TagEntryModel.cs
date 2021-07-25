//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace Collect.Models
{
    public class TagEntryModel
    {
        public int Id { get; set; }
        public Guid TagId { get; set; }
        public string TagName { get; set; }

        // This may not be used in WPF instead corresponding ViewModel
        public Guid DeviceId { get; set; }

        // This won't be used in WPF instead corresponding ViewModel
        public List<ModbusTagDataType> DataTypeList { get; set; }

        public ModbusTagDataType SelectedTagDataType { get; set; }
        public List<ModbusRegisterType> RegisterList { get; set; }
        public ModbusRegisterType SelectedRegisterType { get; set; }
        public string ModbusAddress { get; set; }
        public Guid GroupId { get; set; }
        public string MultiplicationFactor { get; set; }

        public bool Enabled { get; set; } = true;
        public string Status { get; set; } = CollectCommonConstants.DefaultStatus;
    }
}