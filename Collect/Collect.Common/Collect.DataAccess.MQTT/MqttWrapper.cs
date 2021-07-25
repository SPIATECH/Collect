//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using NLog;
using System;
using System.Text;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Messages;

namespace Collect.DataAccess.MQTT
{
    public class MqttWrapper
    {
        #region Properties

        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        private static MqttClient Client { get; set; }
        public string MQTT_BROKER_ADDRESS { get; set; }
        public string SubscriptionTopic { get; set; }
        public IProcessValueFromMqtt ValueObserver { get; set; }
        public static bool IsDisconnectNeeded { get; set; }

        // May be needed by public
        private string clientId { get; set; }

        public string Value { get; set; }

        #endregion Properties

        #region Constructor

        public MqttWrapper(string mqttBrokerString, string subscriptionTopic)
        {
            try
            {
                if (mqttBrokerString == null)
                    MQTT_BROKER_ADDRESS = "127.0.0.1";
                else
                    MQTT_BROKER_ADDRESS = mqttBrokerString;

                SubscriptionTopic = subscriptionTopic;

                // create client instance
                if (Client == null)
                    Client = new MqttClient(MQTT_BROKER_ADDRESS);

                // register to message received
                Client.MqttMsgPublishReceived += client_MqttMsgPublishReceived;
                Client.ConnectionClosed += ReinitializeConnectionInNeed;

                if (string.IsNullOrEmpty(clientId))
                    clientId = Guid.NewGuid().ToString();

                if (!(Client.IsConnected))
                    Client.Connect(clientId);

                if (SubscriptionTopic != null)
                {
                    logger.Trace($"MqttSubscription Added. SubscriptionTopic={SubscriptionTopic};QOS=MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE:{MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE}");
                    Client.Subscribe(new string[] { SubscriptionTopic }, new byte[] { MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE });
                }
                else
                {
                    logger.Trace($"MqttSubscription NOT Added since topic is null.");
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} {1}", "MQTTWrapper failed ", ex);
                logger.Info("MQTT broker seems to be unavailable.");
            }
        }

        private void ReinitializeConnectionInNeed(object sender, EventArgs e)
        {
            logger.Trace($"ReinitializeConnectionInNeed started");
            try
            {
                if (!IsDisconnectNeeded)
                {
                    if (Client.IsConnected)
                    {
                        logger.Trace($"ReinitializeConnectionInNeed about to disconnect. IsDisconnectNeeded={IsDisconnectNeeded};Client.IsConnected={Client.IsConnected}");
                        Client.Disconnect();
                    }

                    Client = new MqttClient(MQTT_BROKER_ADDRESS);
                    if (string.IsNullOrEmpty(clientId))
                        clientId = Guid.NewGuid().ToString();
                    logger.Trace($"ReinitializeConnectionInNeed about to Client.Connect. MQTT_BROKER_ADDRESS={MQTT_BROKER_ADDRESS};IsDisconnectNeeded={IsDisconnectNeeded};Client.IsConnected={Client.IsConnected};clientId={clientId}");
                    Client.Connect(clientId);
                }
            }
            catch (Exception ex)
            {
                logger.Error($"ReinitializeConnetionInNeed Error occured. {ex.ToString()}");
            }
        }

        public void PublishData(string value,string TopicToPublish)
        {
            logger.Trace("PublishData start");
            try
            {
                logger.Trace($"PublishData about to publish. value={value};QOS=MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE:{MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE}");
                Client.Publish(TopicToPublish, Encoding.UTF8.GetBytes(value), MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE, true);
            }
            catch (Exception ex)
            {
                logger.Error($"PublishData Error. {ex.ToString()}");
            }
            logger.Trace("PublishData end");
        }

        #endregion Constructor

        private void client_MqttMsgPublishReceived(object sender, MqttMsgPublishEventArgs e)
        {
            logger.Trace($"client_MqttMsgPublishReceived started");
            try
            {
                string newValue = Encoding.UTF8.GetString(e.Message);
                logger.Trace($"client_MqttMsgPublishReceived before ValueObserver.ProcessValueFromMQTT. Value={newValue};e.Topic={e.Topic}");
                if (ValueObserver != null) ValueObserver.ProcessValueFromMQTT(newValue,e.Topic);
            }
            catch (Exception ex)
            {
                logger.Error($"client_MqttMsgPublishReceived failed {ex.ToString()}");
            }
        }

        public void Disconnect()
        {
            try
            {
                IsDisconnectNeeded = true;
                Client.Disconnect();
            }
            catch (Exception ex)
            {
                logger.Error($"Disconnect Error Occured. {ex.ToString()}");
            }
        }
    }
}
