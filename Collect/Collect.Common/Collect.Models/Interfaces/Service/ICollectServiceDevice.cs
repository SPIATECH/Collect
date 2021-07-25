//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;

namespace Collect.Models
{
    /// <summary>
    /// This interface summarises the all properties needed in a Device by Collect Service.
    /// </summary>
    public interface ICollectServiceDevice
    {
        Guid DeviceId { get; set; }
        string DeviceType { get; set; }
        string Name { get; set; }
        List<ICollectServiceTag> Tags { get; set; }
    }
}
