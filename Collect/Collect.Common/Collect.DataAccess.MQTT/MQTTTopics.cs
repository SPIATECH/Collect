//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


namespace Collect.DataAccess.MQTT
{
    /// <summary>
    ///This class contins the mqtt topics
    /// </summary>
    public static class MqttTopics
    {
        public const string CollectAllGroups = "collect/retain/allgroups";

        public const string CollectIsServiceUpdateNeeded = "collect/IsServiceRefreshNeeded";

        public const string CollectServiceUpdatedAcknowledgment = "collect/ServiceUpdatedAcknowledgment";
    }
}
