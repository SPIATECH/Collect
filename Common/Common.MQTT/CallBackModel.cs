//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;

namespace Common.Mqtt
{
    public class CallBackModel
    {
        public string Topic { get; set; }
        public Tuple<CallbackDelegate, object> CallBackAndObject { get; set; }
        public MessageDataType MessageDataType { get; set; }
        public bool IsReplyToNeeded { get; set; }
        public bool IsMultipartExpected { get; set; }
    }
}