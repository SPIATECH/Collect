//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System.Collections.Generic;
using System.Xml.Serialization;

namespace Common.Utils.Models
{
    /// <summary>
    /// To hold the list of active settings
    /// </summary>
    [XmlRoot("settings")]
    public class ActiveSettings
    {
        [XmlAttribute("username")]
        public string Username { get; set; }

        [XmlElement("setting")]
        public List<SettingsModel> SettingsList { get; set; }
    }
}