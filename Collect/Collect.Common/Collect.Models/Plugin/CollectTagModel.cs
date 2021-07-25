//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using System;

namespace Collect.Models
{
    /// <summary>
    /// Data representation to be used for dealing with Database
    /// read/write and on transfering Data to and from Collect
    /// and collect Plugin.
    /// </summary>
    public class CollectTagModel
    {

        /// <summary>
        /// Id
        /// </summary>
        public int Id { get; set; }
        /// <summary>
        /// Unique id
        /// </summary>
        public Guid TagId { get; set; }

        /// <summary>
        /// This is a user friendly name to Tag.
        /// It is taken from User.
        /// </summary>
        public string TagName { get; set; }

        /// <summary>
        /// This is Unique id of Device. (ie. DeviceDbTag.DeviceId)
        /// </summary>
        public Guid DeviceId { get; set; }

        /// <summary>
        /// Group's Unique id. (ie. GroupEntryModel.GroupId)
        /// </summary>
        public Guid GroupId { get; set; }

        /// <summary>
        /// A set of details related to Device.
        /// For example, ModbusTCP is having details like
        /// RegisterType,Address,MultiplicationFactor etc.
        /// </summary>
        public KeyValuePairManager Details { get; set; }

        public bool Enabled { get; set; } = true;
        public string Status { get; set; } = CollectCommonConstants.DefaultStatus;

        public CollectTagModel()
        {
            Details = new KeyValuePairManager();
        }

        public CollectTagModel GetACloneOfThisTag()
        {
            CollectTagModel tagM = new CollectTagModel()
            {
                Id=Id,
                TagId = TagId,
                TagName = TagName,
                DeviceId = DeviceId,
                GroupId = GroupId,
                Details = Details.GetACloneOfThis()
            };
            return tagM;
        }
    }
}