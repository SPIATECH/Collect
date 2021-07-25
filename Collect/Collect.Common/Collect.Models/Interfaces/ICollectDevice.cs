//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models.Interface;
using System;
using System.Collections.Generic;

namespace Collect.Models.Interface
{
    public interface ICollectDevice
    {
        Guid DeviceId { get; set; }
        string DeviceType { get; set; }
        string Name { get; set; }
    }
}
