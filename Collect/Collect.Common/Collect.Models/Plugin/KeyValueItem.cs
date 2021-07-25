//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System.Xml.Serialization;

namespace Collect.Models
{

    [XmlRoot(ElementName ="KeyValueItem")]
    public class KeyValueItem
    {
        [XmlElement]
        public string Key { get; set; }
        [XmlElement]
        public string Value { get; set; }
    }
}
