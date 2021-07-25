//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Mqtt
{/// <summary>
/// This class is used to store Topics related to Collect and Active.
/// Topics for Mqtt messages are used from this class.
/// </summary>
    public static class MqttTopics
    {

        public static string GetTopicForBinding(int bindID, string clientName, string clientId, string instanceId)
        {
            return $"{MqttCommonConstants.ActiveDataResponse}/{clientName}/{clientId}/{instanceId}/binding/{bindID}";
        }
    }
}