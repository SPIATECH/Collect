//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;
using System.Collections.Generic;

namespace Collect.Models
{
    public class CollectOdbcDevice : ICollectDevice
    {
        #region ICollectDevice

        public Guid DeviceId { get; set; }
        public string DeviceType { get; set; }
        public string Name { get; set; }

        public List<CollectOdbcTag> Tags { get; set; }

        #endregion ICollectDevice

        public string Dsn { get; set; }
        public string TableName { get; set; }
        public string ValueColumn { get; set; }
        public string DateColumn { get; set; }
        public string IdColumn { get; set; }

        public CollectOdbcDevice()
        {
            Tags = new List<CollectOdbcTag>();
        }

        public string[] GetColumnList()
        {
            string[] columns = new string[]
            {
                IdColumn,
                DateColumn,
                ValueColumn
            };
            return columns;
        }
    }
}
