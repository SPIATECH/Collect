//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Common.Models;
using Common.Mqtt.Cryptography;
using NLog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using uPLibrary.Networking.M2Mqtt;
using uPLibrary.Networking.M2Mqtt.Exceptions;
using uPLibrary.Networking.M2Mqtt.Messages;
using System.Linq;
using Common.Utils.Models;

public delegate void CallbackDelegate(string topic, string replyTo, dynamic message);

namespace Common.Mqtt
{
    public class MessageWrapper
    {
        #region Private Properties

        private int mqttbrockerport { get; set; }
        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        private MqttClient Client { get; set; }
        private string ClientId { get; set; }
        private TaskCompletionSource<bool> TaskCompletion = null;
        private List<CallBackModel> CallBackList { get; set; }
        private string PublishAndWaitTopic = "";
        public const byte DefaultQOS = uPLibrary.Networking.M2Mqtt.Messages.MqttMsgBase.QOS_LEVEL_AT_MOST_ONCE;
        private const string TopicRoot = MqttCommonConstants.TopicRoot;
        private readonly bool PrependRootTopic = MqttCommonConstants.PrependRootTopic;
        //Instantiate a Singleton of the Semaphore with a value of 1. This means that only 1 thread can be granted access at a time.
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);

        private readonly string Username = MqttCommonConstants.Username;
        private readonly string Password = MqttCommonConstants.Password;
        private byte[] multipartMessage = null;
        private int multipartTotalSize = 0;
        private int multipartCurrentSize = 0;

        #endregion Private Properties

        #region Public Properties

        public string MqttBrockerAddress { get; set; }
        public dynamic Message { get; set; }

        public bool IsConnected
        {
            get
            {
                return (Client != null && Client.IsConnected == true);
            }
        }

        #endregion Public Properties

        /// <summary>
        /// This is a constructor of MqttWrapper Class.
        /// Here Where Mqtt connection has established according to the mqttBrockerString and Subscription Topic.
        /// </summary>
        /// <param name="mqttBrokerString"> It is combined with MqttBrocker ipaddress and Portaddress.
        /// It is read from configuration file and passed when instantiate this class.
        /// If port address is not given then Default port address will taken. </param>
        /// <param name="subscriptionTopic"> It is used to subscribe a specific data from Mqtt</param>
        /// <param name="valueObserver">This is used for Callback functionality.
        /// This is an instance of a class which implements IObserveValueFromMqtt.</param>

        #region Constructor
        public MessageWrapper(string mqttBrokerString)
        {
            InitialiseAndConnect(mqttBrokerString, MqttCommonConstants.ConnectRetryCount, MqttCommonConstants.ConnectRetryWaitPeriod);
        }

        public MessageWrapper(string mqttBrokerString, int retrycount, int waitperiod)
        {
            InitialiseAndConnect(mqttBrokerString, retrycount, waitperiod);
        }
        #endregion Constructor


        public void InitialiseAndConnect(string mqttBrokerString, int retrycount, int waitperiod)
        {
            logger.Debug($"Constructor started mqttBrockerString:{mqttBrokerString}");
            try
            {
                string[] brokerParts;
                CallBackList = new List<CallBackModel>();
                if (!string.IsNullOrWhiteSpace(mqttBrokerString))
                {
                    /*Extracting the address and port from the string passed from config file.
                     * ipaddress is stored in 0th index and port address is in 1th index.*/

                    brokerParts = mqttBrokerString.Split(':');
                    if (brokerParts == null)
                    {
                        string message = "brokerParts in MqttBrockerString is null";
                        logger.Fatal(message);
                        throw new ArgumentException(message);
                    }

                    MqttBrockerAddress = brokerParts[0];

                    // If port address is specified in the string, that value will be assigned.
                    // Otherwise default value of 1883 will be assigned.
                    mqttbrockerport = (brokerParts.Length > 1) ? int.Parse(brokerParts[1]?.Trim())
                                                              : MqttCommonConstants.DefaultPortAddress;

                    logger.Debug($"MqttBrokerURL: {mqttBrokerString}" +
                                $" MqttClient.Connect MQTT_BROKER_ADDRESS:{MqttBrockerAddress} " +
                                $"MQTT_BROKER_PORT: {mqttbrockerport}");

                    Client = new MqttClient(MqttBrockerAddress, mqttbrockerport, false, null, null, MqttSslProtocols.None, null);
                    Client.MqttMsgPublishReceived += msgReceivedCallback;
                    //This event will be fired when MqttConnection is closed.
                    Client.ConnectionClosed += ReinitializeConnectionInNeed;
                    ClientId = Guid.NewGuid().ToString();

                    logger.Info($"Calling Connect. Cliend ID = {ClientId}");
                    Connect(retrycount, waitperiod);
                    logger.Info($"Connect Completed. isConncted = {IsConnected}");

                }
                else
                {
                    string message = "MqttBrockerString is null";
                    logger.Fatal(message);
                    throw new ArgumentException(message);
                }

            }
            catch (Exception ex)
            {
                logger.Error($"In MqttClient.Constructor exception. MqttBrokerUrlFromConfigFile:{mqttBrokerString}");
                logger.Error($"MQTTWrapper failed, {ex}");
                logger.Error("MQTT broker seems to be unavailable.");
                //Exception type and Custom message is thrown from here to catch at the UI
                throw new MqttException(ex.Message, ex);
            }
            logger.Debug("Contstructor ended");
        }

        /// <summary>
        /// Connect method. This calls the other connect method with required arguments.
        /// </summary>
        public void Connect()
        {
            Connect(MqttCommonConstants.ConnectRetryCount, MqttCommonConstants.ConnectRetryWaitPeriod);
        }


        /// <summary>
        /// Connect method. This will be called from the constructor & later in reconnect
        /// </summary>
        public void Connect(int retrycount, int waitperiod)
        {
            logger.Debug("Started");
            logger.Debug($"client id:{ClientId}");

            int retries = 0;
            // This is not really a infinite loop. 
            // There are 2 scenarios for exiting this while loop:
            //  1. When connect is successful - immedietly returns from this function
            //  2. When retry count reaches the limit, then an exception is thrown
            while (true)
            {
                try
                {
                    byte status = Client.Connect(ClientId, Username, Password, MqttCommonConstants.CleanSession, MqttCommonConstants.KeepAlivePeriod);
                    // Connection Status  is important. 
                    logger.Info($"Connect Status = {status}");
                    if (status == 0)
                    {
                        logger.Info("Connect Success");
                        return;
                    }
                    else
                    {
                        string msg = "Connect Failed due to MQTT Authentication failures";
                        // Append the reason for connect failure
                        if (MqttCommonConstants.MQTTConnectionFailures.ContainsKey(status))
                        {
                            msg = msg + " (" + MqttCommonConstants.MQTTConnectionFailures[status] + ").";
                        }
                        else
                        {
                            logger.Error($"{msg},  Unknown status = {status}");
                        }
                        logger.Error(msg);
                        logger.Error("MQTT broker replied with Authentication failure");
                        logger.Error("No point in retrying");
                        throw new Exception(msg);
                    }
                }
                catch (MqttConnectionException socketex)
                {
                    logger.Error("MqttConnectionException " + socketex);
                    var exception = (socketex.InnerException as System.Net.Sockets.SocketException);
                    string msg = String.Empty;
                    if (exception != null)
                    {
                        if (MqttCommonConstants.TCPErrorCode.ContainsKey(exception.ErrorCode))
                        {
                            msg = MqttCommonConstants.TCPErrorCode[exception.ErrorCode];
                        }
                        else
                        {
                            msg = "Unknown MQTT Error";
                            logger.Error($"{msg},  Unknown ErrorCode = {exception.ErrorCode}");
                        }
                    }
                    if (retries >= retrycount)
                    {
                        //Exception type and Custom message is thrown from here to catch at the UI
                        throw new MqttException(msg, socketex);
                    }
                }
                catch (Exception ex)
                {
                    logger.Error($"Connect failed, {ex}");
                    if (retries >= retrycount)
                    {
                        //Exception type and Custom message is thrown from here to catch at the UI
                        throw new MqttException(ex.Message, ex);
                    }
                }

                retries++;
                logger.Warn($"Retry Count = {retries}");
                logger.Warn($"Waiting for {waitperiod / 1000} Seconds for Connect Retry");
                Thread.Sleep(waitperiod);
            }
        }


        /// <summary>
        /// A Task which keeps reconnecting
        /// Code Reference : https://stackoverflow.com/questions/43547179/how-to-m2mqtt-auto-reconnect
        /// </summary>
        /// 
        private async Task TryReconnectAsync()
        {
            while (!IsConnected)
            {
                try
                {
                    // We don't need connect to retry. Because we have our own retry mechanism
                    Connect(0, 0);
                }
                catch (Exception ex)
                {
                    logger.Error($"Reconnect failed {ex}");
                    logger.Error("MQTT broker seems to be unavailable.");
                }
                logger.Debug($"Waiting for {MqttCommonConstants.ReconnectWaitPeriod}, before reconnecting again");
                await Task.Delay(MqttCommonConstants.ReconnectWaitPeriod);
            }

            logger.Info("Connected!!");
            if (CallBackList.Count < 1)
            {
                logger.Info("No Topics to Re Subscribe in this MQTT Connection");
                return;
            }

            logger.Info("Starting Re Subscription");
            foreach(CallBackModel item in CallBackList)
            {
                bool isReplyToNeeded = item.IsReplyToNeeded;
                bool isMultiPartExpected = item.IsMultipartExpected;
                string subscriptionTopic = item.Topic;
                logger.Info($"Re Subscribing {subscriptionTopic}, ReplytoNeeded? = {isReplyToNeeded}");

                Subscribe(subscriptionTopic, isReplyToNeeded, isMultiPartExpected);

            }

        }

        /// <summary>
        /// When Mqtt has Disconnected un-intentionally it will tries to establish the connection with same clientid
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// 
        private void ReinitializeConnectionInNeed(object sender, EventArgs e)
        {
            logger.Info("Started");
            try
            {
                if (IsConnected)
                {
                    logger.Warn("Connected to Broker. Unexpected here.");
                    return;
                }
                // TODO : Add code to kill any previous tasks
                logger.Debug("Creating a Reconnect Task");
                var t = Task.Run(TryReconnectAsync);
                logger.Debug("Reconnect Task created");
            }
            catch (Exception ex)
            {
                logger.Error($"Exception occured during ReInitialization of Connection {ex}");
            }
            logger.Info("Ended");
        }

        /// <summary>
        /// Subscribes to a topic
        /// </summary>
        /// <param name="subscriptionTopic"></param>
        /// <param name="action"></param>
        public void Subscribe(string subscriptionTopic, Tuple<CallbackDelegate, object> callBackAndObject, MessageDataType dataType, bool isReplyToNeeded = false, bool isMultiPartExpected = false)
        {
            try
            {
                if (isReplyToNeeded && isMultiPartExpected)
                {
                    logger.Fatal($"isReplyToNeeded == true & isMultiPartExpected == true");
                    logger.Fatal($"Cannot handle both features in a single subscription");
                    return;
                }
                logger.Debug($"Started {subscriptionTopic}");
                if (!IsConnected)
                {
                    logger.Fatal("Not connected to MQTT Broker");
                    return;
                }
                //Iterates through the list to check if the topic is subscribed
                CallBackModel callBackElement = CallBackList.Find(x => x.Topic == subscriptionTopic);
                //If topic is not subscribed it will return null and then the topic is subscribed.
                if (callBackElement != null)
                {
                    logger.Warn(subscriptionTopic + " is already subscribed");
                    return;
                }

                logger.Debug($"Subscribes to the topic {subscriptionTopic}");
                CallBackList.Add(new CallBackModel {
                                                    Topic = subscriptionTopic,
                                                    CallBackAndObject = callBackAndObject,
                                                    MessageDataType = dataType,
                                                    IsReplyToNeeded = isReplyToNeeded,
                                                    IsMultipartExpected = isMultiPartExpected
                });
                Subscribe(subscriptionTopic, isReplyToNeeded, isMultiPartExpected);
                logger.Debug($"Completed {subscriptionTopic}");
            }
            catch (Exception ex)
            {
                logger.Error($"Subscription to the topic {subscriptionTopic} failed " + ex);
            }
        }

        /// <summary>
        /// A Helper function for subscribe
        /// </summary>
        private void Subscribe(string subscriptionTopic, bool isReplyToNeeded, bool isMultiPart)
        {
            logger.Info("Started");
            // Adding the Root
            string topic;
            if (PrependRootTopic)
            {
                topic = $"{TopicRoot}/{subscriptionTopic}";
            }
            else
            {
                topic = subscriptionTopic;
            }

            string finaltopic = isReplyToNeeded || isMultiPart ? topic + MqttCommonConstants.MultiLevelWildcard : topic;
            logger.Info($"Final Subscribe: {finaltopic}");
            Client.Subscribe(new string[] { finaltopic }, new byte[] { DefaultQOS });
            logger.Info("Completed");

        }


        /// <summary>
        /// Un Subscribes a topic
        /// </summary>
        /// <param name="subscriptionTopic"></param>
        /// <param name="action"></param>
        public void UnSubscribe(string subscriptionTopic)
        {
            try
            {
                logger.Info($"Started - Unsubscribing {subscriptionTopic}");
                if (!IsConnected)
                {
                    logger.Fatal("Not connected to MQTT Broker");
                    return;
                }
                //Iterates through the list to check if the topic is subscribed or Not
                CallBackModel callBackElement = CallBackList.Find(x => x.Topic == subscriptionTopic);
                //If topic is not subscribed it will return null
                if (callBackElement == null)
                {
                    logger.Debug($"Could not find Subscription of {subscriptionTopic}");
                    return;
                }

                bool isReplyToNeeded = callBackElement.IsReplyToNeeded;
                CallBackList.Remove(callBackElement);

                // Adding the Root 
                string topic;
                if (PrependRootTopic)
                {
                    topic = $"{TopicRoot}/{subscriptionTopic}";
                }
                else
                {
                    topic = subscriptionTopic;
                }

                Client.Unsubscribe(new string[] { isReplyToNeeded ? topic + MqttCommonConstants.MultiLevelWildcard : topic });

                logger.Info($"Completed - Unsubscribing {topic}");

            }
            catch (Exception ex)
            {
                logger.Error($"Subscription to the topic {subscriptionTopic} failed " + ex);
            }
        }


        /// <summary>
        /// Method is used to publish the data into and wait for response
        /// </summary>
        /// <param name="message"></param>
        /// <param name="publishTopic"></param>
        /// <param name="subscriptionTopic"></param>
        /// <param name="timeout"></param>
        /// <param name="dataType"></param>
        /// <param name="replyTo"></param>
        /// <param name="isMultipartResponseExpected"></param>
        /// <param name="isRetained"></param>
        public async Task<TaskStatusAndMessage> PublishDataAndWait(string message, string publishTopic, string subscriptionTopic, int timeout, MessageDataType dataType, string replyTo = null, bool isMultipartResponseExpected = false)
        {
            //Asynchronously wait to enter the Semaphore. If no-one has been granted access to the Semaphore, code execution will proceed,
            //otherwise this thread waits here until the semaphore is released
            await semaphoreSlim.WaitAsync();
            try
            {
                if (!IsConnected)
                {
                    logger.Fatal("Not connected to MQTT Broker");
                    return null;
                }

                if (string.IsNullOrEmpty(publishTopic))
                {
                    logger.Error($"The publish Topic is Null or Empty {publishTopic}");
                    return null;
                }

                logger.Debug($"PublishData started  publishTopic: {publishTopic}");
                // Here, on publishing we need topic
                TaskCompletion = new TaskCompletionSource<bool>();
                Subscribe(subscriptionTopic, null, dataType, false, isMultipartResponseExpected);
                PublishData(message, publishTopic, replyTo, dataType, false);
                PublishAndWaitTopic = subscriptionTopic;
                await Task.WhenAny(TaskCompletion.Task, Task.Delay(timeout));
                if (TaskCompletion.Task.IsCompleted)
                {
                    return new TaskStatusAndMessage
                    {
                        TaskStatus = true,
                        Message = Message
                    };
                }
                else
                {
                    logger.Warn($"Timed out - after waiting for {timeout / 1000} seconds");
                    return new TaskStatusAndMessage
                    {
                        TaskStatus = false,
                        Message = ""
                    };
                }
            }
            catch (Exception ex)
            {
                logger.Error($"PublishData Error: {ex}");
                return null;
            }
            finally
            {
                UnSubscribe(subscriptionTopic);
                //When the task is ready, release the semaphore. It is vital to ALWAYS release the semaphore when we are ready, or else we will end up with a Semaphore that is forever locked.
                //This is why it is important to do the Release within a try...finally clause; program execution may crash or take a different path, this way you are guaranteed execution
                semaphoreSlim.Release();
            }
        }

        /// <summary>
        /// Used for publishing data through mqtt
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="message"></param>
        /// <param name="publishTopic"></param>
        /// <param name="isRetained"></param>
        public void PublishData<T>(T message, string publishTopic, string replyTo, MessageDataType dataType, bool isRetained = false)
        {
            try
            {

                logger.Debug($"started  publishTopic: {publishTopic}");

                if (!IsConnected)
                {
                    logger.Fatal("Not connected to MQTT Broker");
                    return;
                }

                if (string.IsNullOrEmpty(publishTopic))
                {
                    logger.Error($"The publish Topic is Null or Empty {publishTopic}");
                    return;
                }

                // Variable to hold the message to be published. The value parameter will be converted to byte array either by encryption or encoding.
                byte[] publishMessage = null;
                string topic = string.Empty;
                if (replyTo != null)
                {
                    topic = AppendReplyToTopic(publishTopic, replyTo);
                }
                else
                {
                    topic = publishTopic;
                }
                // Add Topic Root
                if (PrependRootTopic)
                    topic = $"{TopicRoot}/{topic}";

                logger.Debug($"topic: {topic}");
                publishMessage = EncodeMessage(message, dataType);
                // Here, on publishing we need topic
                Client.Publish(topic, publishMessage, DefaultQOS, isRetained);
                logger.Debug($"PublishData ended");
            }
            catch (Exception ex)
            {
                logger.Error($"PublishData Error: {ex}");
                return;
            }

        }

        private byte[] EncodeMessage<T>(T message, MessageDataType dataType)
        {
            byte[] ConvertedMessage = null;

            switch (dataType)
            {
                case MessageDataType.Encrypted:
                    ConvertedMessage = EncryptionHelper.EncrptMessage(message as string);
                    break;
                case MessageDataType.String:
                    ConvertedMessage = Encoding.UTF8.GetBytes(message as string);
                    break;
                case MessageDataType.Byte:
                    ConvertedMessage = message as byte[];
                    break;
                default:
                    logger.Fatal($"Unknown Type {dataType}");
                    throw new ArgumentOutOfRangeException($"Unknown Value : {dataType}");
            }

            return ConvertedMessage;
        }

        private dynamic DecodeMessage(byte[] message, MessageDataType dataType)
        {
            dynamic ConvertedMessage = null;

            switch (dataType)
            {
                case MessageDataType.Encrypted:
                    ConvertedMessage = DecryptionHelper.DecryptMessage(message);
                    break;
                case MessageDataType.String:
                    ConvertedMessage = Encoding.UTF8.GetString(message);
                    break;
                case MessageDataType.Byte:
                    ConvertedMessage = message;
                    break;
                default:
                    logger.Fatal($"Unknown Type {dataType}");
                    throw new ArgumentOutOfRangeException($"Unknown Value : {dataType}");
            }

            return ConvertedMessage;
        }


        /// <summary>
        /// A Wrapper funtion for PublsihData
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="message"></param>
        /// <param name="publishTopic"></param>
        /// <param name="isRetained"></param>
        public void PublishData<T>(T message, string publishTopic)
        {
            PublishData(message, publishTopic, null, MessageDataType.String, false);
        }

        /// <summary>
        /// Used for publishing data as multi part messages
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="message"></param>
        /// <param name="publishTopic"></param>
        /// <param name="isRetained"></param>
        public void PublishDataMultiPart<T>(T message, string publishTopic, MessageDataType dataType, int chunkSizeInKB = MqttCommonConstants.multiPartDefaultChunkSizeInKB)
        {
            logger.Debug($"Started  publishTopic: {publishTopic}");

            if (string.IsNullOrEmpty(publishTopic))
            {
                logger.Error($"The publish Topic is Null or Empty {publishTopic}");
                return;
            }

            if (chunkSizeInKB < 1)
            {
                logger.Error($"Chunk Size {chunkSizeInKB} is Not Valid");
                return;
            }
            int chunkSizeInBytes = chunkSizeInKB * 1024;
            // Let's encode before splitting the message
            byte[] publishMessage  = EncodeMessage(message, dataType);
            int msgSize = publishMessage.Length;

            // Each Part should not be encoded OR decoded - just send it untouched.
            MessageDataType partMessageType = MessageDataType.Byte;

            // Send Begin Message
            sendMultiPartBegin(publishTopic, msgSize);

            // ################################
            // Send the Multiple Parts
            // ################################
            int msgsToSend = msgSize / chunkSizeInBytes;
            int msgIndex = 0;
            for (int i = 0; i < msgsToSend; i++, msgIndex = i * chunkSizeInBytes)
            {
                string parttopic = CreateMultipartMessageTopic(publishTopic, msgIndex);
                byte[] partmessage = publishMessage.Skip(msgIndex).Take(chunkSizeInBytes).ToArray();
                logger.Debug($"Sending Multi Part Message no: {i} topic = {parttopic}");
                PublishData(partmessage, parttopic, null, partMessageType, false);
            }

            // Check if last part is remaining
            int remaining = msgSize % chunkSizeInBytes;
            if (remaining != 0)
            {
                string parttopic = CreateMultipartMessageTopic(publishTopic, msgIndex);
                byte[] partmessage = publishMessage.Skip(msgIndex).Take(remaining).ToArray();
                PublishData(partmessage, parttopic, null, partMessageType, false);

            }

            // Send Begin Message
            string checksum = EncryptionHelper.CalculateChecksum(publishMessage);
            logger.Info($"Checksum = {checksum}");
            sendMultiPartEnd(publishTopic, checksum);

            // Here, on publishing we need topic
            logger.Debug($"PublishData ended");
        }

        private string CreateMultipartMessageTopic(string basetopic, int index)
        {
            return basetopic + MqttCommonConstants.multiPartIndex + index.ToString();
        }

        private void sendMultiPartBegin(string basetopic, int size)
        {
            try
            {
                logger.Info($"Sending Begin message for {basetopic}");
                string begintopic = basetopic + MqttCommonConstants.multiPartBegin;
                MultiPartBegin beginMessage = new MultiPartBegin { MessageTotalSize = size };
                string message = Serializer.JsonSerializer(beginMessage);
                PublishData(message, begintopic);
            }
            catch (Exception ex)
            {
                logger.Error($"Failed. {ex.Message}");
            }
        }

        private void sendMultiPartEnd(string basetopic, string checksum)
        {
            try
            {
                logger.Info($"Sending End message for {basetopic}");
                string begintopic = basetopic + MqttCommonConstants.multiPartEnd;
                MultiPartEnd EndMessage = new MultiPartEnd { CheckSum = checksum };
                string message = Serializer.JsonSerializer(EndMessage);
                PublishData(message, begintopic);
            }
            catch (Exception ex)
            {
                logger.Error($"Failed. {ex.Message}");
            }
        }

        /// <summary>
        /// Concatenates publish topic and reply topic
        /// </summary>
        /// <param name="publishTopic"></param>
        /// <param name="replyTopic"></param>
        /// <returns></returns>
        private string AppendReplyToTopic(string publishTopic, string replyTopic)
        {
            return $"{publishTopic}{MqttCommonConstants.ReplyTo}{replyTopic}";
        }

        /// <summary>
        /// Gets the publish topic from the topic
        /// </summary>
        /// <param name="topic"></param>
        /// <returns></returns>
        private string ExtractPublishTopic(string topic)
        {
            try
            {
                string publishTopic = String.Empty; ;
                if (PrependRootTopic)
                {
                    publishTopic = topic.Split(new string[] { TopicRoot + "/" }, StringSplitOptions.None)[1];
                }
                else
                {
                    publishTopic = topic;
                }
                publishTopic = publishTopic.Split(new string[] { MqttCommonConstants.ReplyTo }, StringSplitOptions.None)[0];
                publishTopic = publishTopic.Split(new string[] { MqttCommonConstants.multiPartTopic }, StringSplitOptions.None)[0];

                logger.Debug("Publish Topic:" + publishTopic);
                return publishTopic;
            }
            catch (Exception ex)
            {
                logger.Error(" failed" + ex);
                return string.Empty;
            }
        }

        /// <summary>
        /// Gets the replyto topic from the topic
        /// </summary>
        /// <param name="topic"></param>
        /// <returns></returns>
        private string ExtractReplyToTopic(string topic)
        {
            try
            {
                string[] splitCount = topic.Split(new string[] { MqttCommonConstants.ReplyTo }, StringSplitOptions.None);
                if (splitCount.Length == 2)
                {
                    logger.Debug("ReplyTo Topic:" + splitCount[1]);
                    return splitCount[1];
                }
                else
                {
                    logger.Trace("Topic does not contain ReplyTo Topic");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error(" failed" + ex);
                return null;
            }
        }

        /// <summary>
        /// Gets the Multipart section of the topic
        /// </summary>
        /// <param name="topic"></param>
        /// <returns></returns>
        private string ExtractMultipartTopic(string topic)
        {
            try
            {
                string[] splitCount = topic.Split(new string[] { MqttCommonConstants.multiPartTopic}, StringSplitOptions.None);
                if (splitCount.Length == 2)
                {
                    string mtopic = splitCount[1];
                    logger.Debug("Multipart Topic:" + mtopic);
                    return mtopic;
                }
                else
                {
                    logger.Trace("Topic does not contain Multi part Topic");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error(" failed" + ex);
                return null;
            }
        }

        private string ExtractMultipartIndex(string topic)
        {
            try
            {
                string[] splitCount = topic.Split(new string[] { MqttCommonConstants.multiPartIndex }, StringSplitOptions.None);
                if (splitCount.Length == 2)
                {
                    string mtopic = splitCount[1];
                    logger.Debug("Multipart Index :" + mtopic);
                    return mtopic;
                }
                else
                {
                    logger.Trace("Topic does not contain index");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error(" failed" + ex);
                return null;
            }
        }


        private dynamic reassembleMultipartMessage(string multipart, string receivedTopic, dynamic rawMessage)
        {
            logger.Info($"Multi part message detected ({multipart})");
            string state = String.Empty;
            if (multipart.IndexOf(MqttCommonConstants.mpartDataIndex) == -1)
            {
                // This is either Begin or End
                state = multipart;
            }
            else
            {
                // This is data tranfer message
                state = MqttCommonConstants.mpartDataIndex;
            }

            switch (state)
            {
                case MqttCommonConstants.mpartBegin:
                    logger.Info("Begin Detected");
                    MultiPartBegin mpart = Serializer.JsonDeserializer<MultiPartBegin>(Encoding.UTF8.GetString(rawMessage));
                    int TotalSize = mpart.MessageTotalSize;
                    logger.Info($"Message Total size = {TotalSize}");
                    if (TotalSize < 1)
                    {
                        logger.Error($"Total size ({TotalSize}) is not valid");
                        return null;
                    }
                    multipartTotalSize = TotalSize;
                    multipartCurrentSize = 0;
                    // Allocate space for the whole message
                    multipartMessage = new byte[multipartTotalSize];
                    return null;


                case MqttCommonConstants.mpartDataIndex:
                    // It's an intermediate data transfer message
                    logger.Info("Data Transfer Detected");
                    string multipartIndex = ExtractMultipartIndex(receivedTopic);
                    logger.Trace("Multipart Index:" + multipartIndex);
                    int Index;
                    int.TryParse(multipartIndex, out Index);
                    int length = rawMessage.Length;
                    logger.Info($"Multi part Index(int) = {Index}, Length = {length}");
                    Array.Copy(rawMessage, 0, multipartMessage, Index, length);
                    multipartCurrentSize += length;
                    return null;


                case MqttCommonConstants.mpartEnd:
                    logger.Info("End Detected");
                    MultiPartEnd mpartend = Serializer.JsonDeserializer<MultiPartEnd>(Encoding.UTF8.GetString(rawMessage));
                    string remoteChecksum = mpartend.CheckSum;

                    logger.Info($"Current Size = {multipartCurrentSize}");
                    logger.Info($"Total Size = {multipartTotalSize}");
                    if (multipartCurrentSize != multipartTotalSize)
                    {
                        logger.Error("Current size and Total Size not equal");
                        return null;
                    }

                    string localChecksum = EncryptionHelper.CalculateChecksum(multipartMessage);
                    logger.Info($"Remote Checksum = {remoteChecksum}");
                    logger.Info($"Local Checksum = {localChecksum}");

                    if (remoteChecksum != localChecksum)
                    {
                        logger.Error($"local checksum & remote checksum not maching");
                        return null;
                    }
                    logger.Info("We got th complete message");
                    // Assign it to the right variable for further processing
                    return multipartMessage;


                default:
                    logger.Fatal($"Unknown multipart message ({multipart})");
                    throw new ArgumentOutOfRangeException($"Unknown Value : {multipart}");
            }


        }


        /// <summary>
        /// This Method will invoke when client_MqttmMgpublishreceived event get's fired.
        /// Here we will get the data according to the subscription topic.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void msgReceivedCallback(object sender, MqttMsgPublishEventArgs e)
        {
            await MessageWrapperCallback(e.Topic, e.Message);
        }

        private async Task MessageWrapperCallback(string receivedTopic, dynamic rawMessage)
        {
            logger.Debug($"Started. Topic = {receivedTopic}");
            try
            {
                //logger.Debug("CurrentContext:" + Thread.CurrentContext +
                //             ". CurrentThread Name: " + Thread.CurrentThread.Name);

                dynamic messageToDecode = null;
                dynamic decodedMessage = null;
                if (CallBackList.Count <= 0)
                {
                    logger.Fatal("Callback list is empty");
                    return;
                }

                string baseTopic = ExtractPublishTopic(receivedTopic);
                logger.Debug("Publish Topic:" + baseTopic);
                string replyToTopic = ExtractReplyToTopic(receivedTopic);
                logger.Trace("ReplyTo Topic:" + replyToTopic);
                string multipart = ExtractMultipartTopic(receivedTopic);
                logger.Trace("Multipart Topic:" + multipart);

                CallBackModel callBackModel = CallBackList.Find(x => x.Topic == baseTopic);
                if (callBackModel == null)
                {
                    logger.Error($"{baseTopic} does not exist in the CallBackList");
                    return;
                }

                if (multipart == null)
                {
                    // #########################
                    // NORMAL Message
                    // #########################
                    logger.Info("Normal Message");
                    messageToDecode = rawMessage;
                }
                else
                {
                    // #########################
                    // Multi part Handling
                    // #########################
                    dynamic reassembledMessage = reassembleMultipartMessage(multipart, receivedTopic, rawMessage);
                    if (reassembledMessage == null)
                    {
                        // Re assembly is not completed. 
                        // Just wait for more messages
                        return;
                    }
                    messageToDecode = reassembledMessage;
                    // Reset the class variables
                    multipartMessage = null;
                    multipartCurrentSize = 0;
                    multipartTotalSize = 0;
                }


                // Normal Message Handling
                logger.Debug("Decode Start");
                decodedMessage = DecodeMessage(messageToDecode, callBackModel.MessageDataType);
                logger.Debug("Decode Complete");



                await Task.Factory.StartNew(() =>
                {
                    logger.Debug("New Task");
                    //Checks if received messages topic is same as the topic subscribed while doing publish and wait
                    if (callBackModel.CallBackAndObject == null)
                    {

                        // ##################################################################
                        //   Publish And Wait Handling
                        // ##################################################################
                        logger.Info("Publish And Wait Handling");
                        if (decodedMessage == null)
                        {
                            logger.Fatal("Message cannot be null");
                            return;
                        }

                        if (baseTopic == PublishAndWaitTopic)
                        {
                            // This is a PublishDataAndWait call back.
                            Message = decodedMessage;
                            // Clearing the topic for the next usage of PublishDataAndWait()
                            PublishAndWaitTopic = String.Empty;
                            TaskCompletion?.TrySetResult(true);
                        }
                        else
                        {
                            logger.Warn($"topic {baseTopic} != PublishAndWait Topic {PublishAndWaitTopic}");
                            logger.Warn("It could be a late reply to PublishAndWait");
                        }
                    }
                    else
                    {
                        // ##################################################################
                        //   Normal Subscription handling
                        // ##################################################################
                        //Then it means the message is from a previously subscribed topic and calls the method asssociated to that topic
                        logger.Info("Normal Subscription Handling");

                        callBackModel.CallBackAndObject.Item1(baseTopic, replyToTopic, decodedMessage);
                    }
                    logger.Debug($"Completed");
                });
            }
            catch (Exception ex)
            {
                logger.Error($"Failed {ex}");
            }
            finally
            {
                logger.Debug($"MessageWrapperCallback Ended. Topic = {receivedTopic}");
            }
        }

        /// <summary>
        /// Method used to Disconnect the Connection between Client and MqttBrocker
        /// </summary>
        public void Disconnect()
        {
            logger.Debug($"Disconnect started.");
            try
            {
                logger.Debug($"Disconnect IsConnected={IsConnected}.");
                if (!IsConnected)
                {
                    logger.Fatal("Not connected to MQTT Broker");
                    return;
                }
                logger.Trace("Going to unsubscribe all existing subscriptions");
                // Using ToArray - because the CallBaclList is being modofied in UnSubscribe
                foreach (CallBackModel item in CallBackList.ToArray())
                {
                    UnSubscribe(item.Topic);
                }
                // Disable the connection closed event handler. Otherwise it will fire when we disconnect.
                Client.ConnectionClosed -= ReinitializeConnectionInNeed;
                Client?.Disconnect();
                logger.Debug($"Disconnect Disconnected Client. clientId:{ClientId}");
            }
            catch (Exception ex)
            {
                logger.Error($"Disconnect Error: {ex}");
            }
            logger.Debug($"Disconnect ended.");
        }

        ~MessageWrapper()

        {
            Disconnect();
        }
    }
}