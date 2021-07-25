//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;

namespace Collect.Models
{
    public class CollectOdbcTag : ICollectTag
    {
        #region ICollectTag

        public string TagName { get; set; }
        public dynamic Value { get; set; }
        public Guid TagId { get; set; }
        public ICollectServiceDevice Device { get; set; }

        public string GetTagInfo()
        {
            return $"{TagName}::{TagId}::{Device.Name}";
        }

        #endregion ICollectTag

        /// <summary>
        /// This is value corresponding to IdColumn in CollectOdbcDevice
        /// </summary>
        public string TagIdValue { get; set; }

        /// <summary>
        /// This is used on querying data from ODBC
        /// This is get from InfluxDb
        /// Since, DateTime is not nullable, the garbage value is in DateTime fields
        /// difficult to handle, I am using a nullable DateTime? type
        /// </summary>
        public DateTime? LastReadTime { get; set; }
    }
}
