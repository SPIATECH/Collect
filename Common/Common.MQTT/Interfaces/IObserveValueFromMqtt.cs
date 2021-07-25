//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Mqtt
{
    // This the interface to deal with value updates
    // once new value is Published to the clients by MQTT 
    // or TSDB value is recieved
    public interface IObserveValueFromMqtt
    {
        void ProcessValueFromMQTT(string ValueAsString,string topic);
    }
}
