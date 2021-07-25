//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Utils.Models;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace Common.Utils.Controls
{
    public class ComboboxSettingsItem : SettingsModel
    {
        public List<string> ValueList { get; set; }
    }
}