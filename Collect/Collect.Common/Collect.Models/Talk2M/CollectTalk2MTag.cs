//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;
using System.Xml.Serialization;

namespace Collect.Models
{
    /// <summary>
    /// This is the model used for representing CollectTalk2MTag
    /// </summary>
    [XmlRoot(ElementName = "CollectTalk2MTag")]
    public class CollectTalk2MTag : ICollectTag, ICollectServiceTag
    {
        #region ICollectTag

        public string TagName { get; set; }
        public dynamic Value { get; set; }
        public Guid TagId { get; set; }

        #endregion ICollectTag

        public ICollectServiceDevice Device { get; set; }
        public int Talk2MTagId { get; set; }
        public string Datatype { get; set; }
        public int EwonTagId { get; set; }

        public CollectTalk2MTag()
        { }

        public string GetTagInfo()
        {
            var talk2MDevice = Device as CollectTalk2MDevice;
            return $"{talk2MDevice.Name}:{talk2MDevice.DeviceId}:{talk2MDevice.DeviceDetail}:{TagName}:{TagId}";
        }
    }
}
