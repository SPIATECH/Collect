//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace Collect.Models
{
    /// <summary>
    /// This is the model used for representing CollectTalk2MDevice
    /// </summary>
    [XmlRoot(ElementName = "CollectTalk2MDevice")]
    public class CollectTalk2MDevice : ICollectDevice, ICollectServiceDevice
    {
        #region Properties

        #region ICollectDevice

        public Guid DeviceId { get; set; }
        public string DeviceType { get; set; }
        public string Name { get; set; }

        [XmlIgnore]
        public List<ICollectServiceTag> Tags { get; set; }

        #endregion ICollectDevice
        public string DeviceDetail { get; set; }

        public string Talk2MDevId { get; set; }
        public string Talk2MAccountId { get; set; }
        public string Talk2MAccount { get; set; }
        public string Talk2MUsername { get; set; }
        public string Talk2MPassword { get; set; }
        public string Talk2MIsAccountRefreshNeeded { get; set; }


        #endregion Properties

        public CollectTalk2MDevice(string name, Guid deviceId, string deviceDetail, string devID, string accountId, string account, string userName, string password, string isAccountRefreshNeeded)
        {
            this.DeviceDetail = deviceDetail;
            this.DeviceId = deviceId;
            this.Name = name;
            this.Talk2MAccountId = accountId;
            this.Talk2MAccount = account;
            this.Talk2MDevId = devID;
            this.Talk2MUsername = userName;
            this.Talk2MPassword = password;
            this.Talk2MIsAccountRefreshNeeded = isAccountRefreshNeeded;
            Tags = new List<ICollectServiceTag> { };
        }

        public CollectTalk2MDevice()
        {
        }
    }
}
