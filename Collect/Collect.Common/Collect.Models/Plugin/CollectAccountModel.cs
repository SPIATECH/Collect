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
    public class CollectAccountModel
    {
        /// <summary>
        /// Unique id
        /// </summary>
        public Guid AccountId { get; set; }

        /// <summary>
        /// This used for specifying Account Type
        /// like "Talk2m","Secunet" etc.
        /// </summary>
        public string AccountType { get; set; }

        /// <summary>
        /// A user friendly name, this taken from User input
        /// </summary>
        public string AccountName { get; set; }

        public bool Enabled { get; set; } = true;
        public string Status { get; set; } = CollectCommonConstants.DefaultStatus;

        /// <summary>
        /// A set of details related to Account.
        /// This field is serialized on saving into db or xml.
        /// Also load into this field by deserializing.
        /// </summary>
        public KeyValuePairManager Details { get; set; }

        public CollectAccountModel()
        {
            Details = new KeyValuePairManager();
        }
    }
}