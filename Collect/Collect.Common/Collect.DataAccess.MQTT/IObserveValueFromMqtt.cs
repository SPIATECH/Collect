//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


namespace Collect.DataAccess.MQTT
{
    // This the interface to deal with value updates
    // once new value is Published to the clients by MQTT
    // or TSDB value is recieved
    public interface IProcessValueFromMqtt
    {
        void ProcessValueFromMQTT(string ValueAsString, string Topic);
    }
}
