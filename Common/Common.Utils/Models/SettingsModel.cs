//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Newtonsoft.Json;
using System.Xml.Serialization;

namespace Common.Utils.Models
{
    /// <summary>
    /// To hold the key and value of each active setting
    /// </summary>
    public class SettingsModel
    {
        [XmlAttribute("Key")]
        [JsonProperty(PropertyName = "Key")]
        public string Id { get; set; }
        
        [XmlAttribute]
        public string Value { get; set; }

        /// <summary>
        /// This property is to return Id if DisplayName is not set for settings item.
        /// </summary>
        private string displayName;
        [XmlIgnore]
        [JsonIgnore]
        public string DisplayName
        {
            get
            {
                if (string.IsNullOrWhiteSpace(displayName))
                {
                    return Id;
                }
                else
                    return displayName;
            }
            set
            {
                displayName = value;
            }
        }
    }
}
