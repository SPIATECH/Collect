//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;

namespace Collect.Models
{
    /// <summary>
    /// This interface summarises all common properties and methods needed by a Collect service as CollectServiceTag
    /// </summary>
    public interface ICollectServiceTag
    {
        ICollectServiceDevice Device { get; set; }
        Guid TagId { get; set; }
        string TagName { get; set; }
        dynamic Value { get; set; }

        string GetTagInfo();
    }
}
