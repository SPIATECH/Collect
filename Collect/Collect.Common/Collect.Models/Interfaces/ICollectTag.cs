//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


﻿using System;

namespace Collect.Models.Interface
{
    public interface ICollectTag
    {
        string TagName { get; set; }
        dynamic Value { get; set; }
        Guid TagId { get; set; }

        string GetTagInfo();
    }
}