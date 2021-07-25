//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.Models;
using Common.Models;
using Common.Mqtt;
using Common.Utils.Timers;
using NLog;
using System;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.Reflection;
using System.Runtime.Versioning;
using System.ServiceProcess;
using Common.Utils;
using System.Threading.Tasks;
using Common.Utils.Models;
using System.Linq;

namespace Collect.Common.Service
{
    /// <summary>
    /// A base class summarises all common properties and methods
    /// needed by a Collect service as ServiceBase (Windows Service) implementation.
    /// </summary>
    public partial class CollectServiceCommonBase
    {
        #region Public Properties

        // Setting the Default here. This must be overwritten by individual Device Type Classes
        public string DeviceSignature = CollectCommonConstants.DeviceSignatureDefault;
        public string DeviceRegistration = string.Empty;
        public string TagRegistration = string.Empty;
        public string ServiceName = string.Empty;

        public ICollectServiceDeviceManager DeviceManager { get; set; }
        public Double PollingRate
        {
            get
            {
                return _PollingRate;
            }
            set
            {
                if (_PollingRate != value)
                {
                    isSettingsChanged = true;
                }
                _PollingRate = value;
            }
        }
        public Double LoggingRate
        {
            get
            {
                return _LoggingRate;
            }
            set
            {
                if (_LoggingRate != value)
                {
                    isSettingsChanged = true;
                }
                _LoggingRate = value;
            }
        }

        public static string BrokerUrl { get; set; }

        // To get the settings via MQTT Broker 
        public ActiveSettings Settings { get; set; }

        #endregion Public Properties

        #region Private Properties

        // Settings variables
        private Double _PollingRate;
        private Double _LoggingRate;

        private bool isSettingsChanged = false;

        private AccurateTimer PollingTimer { get; set; }
        private string xmlTagData = string.Empty;
        private MessageWrapper messageWrapper;
        private int sampleCount = 0;
        private int tickCount = 0;
        private bool IsCollectServiceUpdateNeeded = false;
        private bool PauseWriteToDB = false;
        private Logger logger = LogManager.GetCurrentClassLogger();
        private string version;
        private Guid ClientId;
 


        #endregion Private Properties

        #region Constructor

        public CollectServiceCommonBase(ICollectServiceDeviceManager deviceManager)
        {
            try
            {
                ClientId = Guid.NewGuid();
                DeviceManager = deviceManager;
                InitializeComponent();

                logger.Error(Environment.NewLine + Environment.NewLine);
                logger.Error($"**CollectServiceCommonBase** GUID = {ClientId}");

                //Code to print the target framework of the application.
                var targetFw = Assembly.GetExecutingAssembly().GetCustomAttributes(typeof(TargetFrameworkAttribute), false);
                TargetFrameworkAttribute targetFramework = targetFw[0] as TargetFrameworkAttribute;
                var fwAsString = string.Empty;
                if (targetFramework != null)
                {
                    fwAsString = targetFramework.FrameworkDisplayName;
                }
                logger.Error($"Target framework of the applciation is : {fwAsString}");

                this.version = ProjectVersions.CollectTCPServer;

                logger.Error($"Version: {version}");

                logger.Error($"Application Configuration");
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        #endregion Constructor

        private void InitializeTimer()
        {
            bool isValid = true;
            // Iinitialise the count variables here. This is needed becuause this function will be ccalled
            // at truntime also, when Polling Rate and Logging Rate changes via a Settings change. 
            // Fix for a Problem reported (Data not written to Histoical DB issue)
            sampleCount = 0;
            tickCount = 0;
            try
            {
                double realtimeTimerValue = PollingRate;

                double historicalTimerValue = LoggingRate;

                logger.Info($"realtimeTimerValue = {realtimeTimerValue}");
                logger.Info($"historicalTimerValue = {historicalTimerValue}");

                //Checks: 1. If polling and logging rates are less than 1 second.
                //        2. If logging rate is less than polling rate.
                //        3. If logging rate is a multiple of logging rate.
                if (realtimeTimerValue < 1000 || historicalTimerValue < 1000 ||
                        historicalTimerValue < realtimeTimerValue || historicalTimerValue % realtimeTimerValue > 0)
                {
                    isValid = false;
                }
                else
                {
                    sampleCount = Convert.ToInt32(historicalTimerValue / realtimeTimerValue);
                    logger.Debug("Calculated sample Count : " + sampleCount);
                }

                logger.Debug("Sample Count : " + sampleCount);

                if (isValid == true && sampleCount > 0)
                {
                    PollingTimer = new AccurateTimer((uint)realtimeTimerValue, PollingTimerTickHandler);
                    PollingTimer.Start();
                }
                else
                {
                    logger.Error($"Invalid Time value in Settings. Kindly check logging ({historicalTimerValue}) and polling rates ({realtimeTimerValue}).");
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Error initializing timers**", ex);
            }
        }

        private void PollingTimerTickHandler()
        {
            tickCount++;
            bool isHistorical = false;
            try
            {
                // For measuring time taken for execution
                var stopWatch = new Stopwatch();
                stopWatch.Start();
                logger.Debug("PollingTimerTickHandler start");
                logger.Debug("Tick Count :" + tickCount + ", Sample Count : " + sampleCount);

                if (IsCollectServiceUpdateNeeded)
                {
                    logger.Debug("IsCollectServiceUpdateNeeded = true");
                    DeviceManager.GetListofDevices();
                    SendAckForUpdate();
                    IsCollectServiceUpdateNeeded = false;
                    logger.Debug("IsCollectServiceUpdateNeeded = false");
                }

                if (tickCount == sampleCount)
                {
                    isHistorical = true;
                    tickCount = 0;
                    logger.Debug("Historical set to true");
                }

                if(!PauseWriteToDB)
                DeviceManager.UpdateAllDeviceTags(isHistorical);

                // For time measurement
                stopWatch.Stop();
                var timeForRefreshTimeTick = stopWatch.Elapsed.TotalMilliseconds;
                if (timeForRefreshTimeTick > (PollingTimer.IntervalInMilliSeconds))
                    logger.Warn($"time taken For RefreshTimer_Tick ({timeForRefreshTimeTick}) is greater than refreshTimer." +
                                $"IntervalInMilliSeconds ({PollingTimer.IntervalInMilliSeconds}).");

                logger.Debug($"PollingTimerTickHandler end  (ms):{timeForRefreshTimeTick}");
            }
            catch (Exception tim)
            {
                logger.Error("{0} || {1}", "**Timer failed**", tim);
            }
        }

        private void DeInitilize()
        {
            logger.Debug("Stopping the Timer");
            PollingTimer.Stop();
            logger.Debug("Polling Timer Stopped");
            stopThreads();
        }

        private TimeSpan CalcTimeSpanToWait(DateTime tnow, int seconds)
        {
        
            logger.Info($"Seconds To Wait = {seconds}");

            var temptimeSynch = tnow.AddSeconds(seconds);
            var timeNextSynch = new DateTime(
                temptimeSynch.Year,
                temptimeSynch.Month,
                temptimeSynch.Day,
                temptimeSynch.Hour,
                temptimeSynch.Minute,
                temptimeSynch.Second);
            return timeNextSynch - tnow;
        }

        public void WaitForTimeAlignment()
        {
            logger.Debug("Started");
            // DateTime Formatter
            string dateForm = DatetimeConstants.DateTimeFormatterString;
            Func<DateTime, string> dateFo = (DateTime date) => { return date.ToString(dateForm, CultureInfo.InvariantCulture); };
            // TimeSpan Formatter
            Func<TimeSpan, string> tsFo = (TimeSpan date) => { return date.ToString(); };
            try
            {
                var timeNow = DateTime.Now;
                int currentSecond = timeNow.Second;
                TimeSpan timeSpanToWait;

                int PollingRateSeconds = (int)PollingRate / 1000;
                if (PollingRateSeconds == 1)
                {
                    logger.Info($"Polling Rate == {PollingRateSeconds}. Nothing to Wait");
                    // This means no waiting
                    timeSpanToWait = timeNow - timeNow;
                }
                else if (PollingRateSeconds > 30 || currentSecond > 50)
                {

                    logger.Info($"If Polling Rate {PollingRateSeconds} is greater than 50, Just wait for next minute");
                    logger.Info($"Current Second = {currentSecond}");

                    var timeNextMinute1 = timeNow.AddMinutes(1);
                    var timeNextMinute2 = new DateTime(timeNextMinute1.Year,
                        timeNextMinute1.Month,
                        timeNextMinute1.Day,
                        timeNextMinute1.Hour,
                        timeNextMinute1.Minute, 0);
                    timeSpanToWait = timeNextMinute2 - timeNow;

                }
                else if (PollingRateSeconds % 30 == 0)
                {
                    logger.Info($"Polling Rate {PollingRateSeconds} is a multiple of 30. Just align to 30");
                    int secondsToWait = 30 - (currentSecond % 30);
                    timeSpanToWait = CalcTimeSpanToWait(timeNow, secondsToWait);
                }
                else if (PollingRateSeconds % 20 == 0)
                {
                    logger.Info($"Polling Rate {PollingRateSeconds} is a multiple of 20. Just align to 20");
                    int secondsToWait = 20 - (currentSecond % 20);
                    timeSpanToWait = CalcTimeSpanToWait(timeNow, secondsToWait);
                }
                else if (PollingRateSeconds % 10 == 0)
                {
                    logger.Info($"Polling Rate {PollingRateSeconds} is a multiple of 10. Just align to 10");
                    int secondsToWait = 10 - (currentSecond % 10);
                    timeSpanToWait = CalcTimeSpanToWait(timeNow, secondsToWait);
                }
                else if (PollingRateSeconds % 5 == 0)
                {
                    logger.Info($"Polling Rate {PollingRateSeconds} is a multiple of 5 (But not 10). Just align to 5");
                    int secondsToWait = 5 - (currentSecond % 5);
                    timeSpanToWait = CalcTimeSpanToWait(timeNow, secondsToWait);
                }
                else
                {
                    // Generic Waiting
                    // Find out how many seconds needs to synchup to the Polling Rate
                    int secondsToWait = (int)PollingRateSeconds - (currentSecond % (int)PollingRateSeconds);

                    logger.Info($"sseconds To Wait = {secondsToWait}");
                    timeSpanToWait = CalcTimeSpanToWait(timeNow, secondsToWait);
                }

                logger.Info($"Before wait. DateTime.Now:{dateFo(DateTime.Now)}, " +  $"Time Span to wait : {tsFo(timeSpanToWait)}");

                // Wait for a good Alignment in Time
                System.Threading.Thread.Sleep(timeSpanToWait);
                logger.Info($"Thread.Sleep Completed. DateTime.Now:{dateFo(DateTime.Now)}");
            }
            catch (Exception ex)
            {
                logger.Error($"Exception {ex.ToString()}");
            }
            logger.Debug($"Ended.DateTime.Now:{dateFo(DateTime.Now)}");
        }

        /// <summary>
        /// To get settings needed for collect. It will retry if no response recieved (there is a chance of no response,
        /// becuase Key Server may not be up when collect is ready) 
        /// </summary>
        private async Task<bool> GetSettings(int timeout)
        {
            try
            {
                logger.Trace("Get settings started");

                // Since it depends on message reply from another service, make sure we wait and retry.
                // Hopefully Key Service is started already. 
                for (int i = 0; i < CollectCommonConstants.settingRetryCount; i++)
                {
                    string usernameXML = CollectSerializer.Serializer(CollectCommonConstants.settingsUsername);
                    string response = $"{MqttCommonConstants.SettingResponse}/{ClientId}";
                    TaskStatusAndMessage settingsTask = await messageWrapper.PublishDataAndWait(
                                                                        usernameXML,
                                                                        MqttCommonConstants.SettingRequest,
                                                                        response,
                                                                        timeout,
                                                                        MessageDataType.String,
                                                                        response);
                    if (settingsTask.TaskStatus)
                    {
                        logger.Debug("Settings response received");
                        string tempSettingString = settingsTask.Message;
                        logger.Debug($"Settings response : {tempSettingString}");
                        Settings = Serializer.XmlDeserializer<ActiveSettings>(settingsTask.Message);
                        return true;
                    }
                    else
                    {
                        logger.Warn($"Settings message not received. Retry count : {i}");
                    }
                }
                return false;
            }
            catch (Exception exc)
            {
                logger.Error(exc.Message, " for receiving active settings failed");
                return false;
            }
        }

        /// <summary>
        /// To Set settings variables needed for collect.
        /// </summary>

        private bool SetSettings()
        {
            try
            {
                // Polling Rate & Logging Rate from settings comes in Seconds Unit
                // Internally we need it in milliseconds. So we will do the conversion here.
                UInt32 tempPollingRateInSeconds = Convert.ToUInt32(Settings.SettingsList.FirstOrDefault(x => x.Id == CollectCommonConstants.settingsPollingRateFieldName).Value.ToString());
                PollingRate = tempPollingRateInSeconds * 1000;

                UInt32 tempLoggingRateinSeconds = Convert.ToUInt32(Settings.SettingsList.FirstOrDefault(x => x.Id == CollectCommonConstants.settingsLoggingRateFieldName).Value.ToString());
                LoggingRate = tempLoggingRateinSeconds * 1000;
                return true;
            }
            catch (Exception exc)
            {
                logger.Error(exc.Message, "Collect Settings configuration failed..!");
                return false;
            }
        }

        private bool Initialize(bool onstartSequence)
        {
            bool settingsStatus = false;

            // Initialise the flag. This will be set to true automatically if any of the settings is changed.
            isSettingsChanged = false;
            try
            {
                // Getting the settings. Since this is an async function, we have to wait for completion.
                GetSettings(CollectCommonConstants.settingsTimeout).Wait();
                if (SetSettings())
                {
                    settingsStatus = true;
                    logger.Info("SetSettings completed Successfully");
                }
                else
                {
                    settingsStatus = false;
                    logger.Error("SetSettings Failed");
                }

                if (!settingsStatus)
                {
                    // Getting settings from Key (via MQTT messaging) failed
                    // We can either exit collect here OR Set default values and proceed

                    logger.Error("Going ahead with default Logging Rate & Polling Rate");
                    // We need the Rates in millisecond unit for timers. So do the conversion. 
                    LoggingRate = CollectCommonConstants.defaultLoggingRateSeconds * 1000;
                    PollingRate = CollectCommonConstants.defaultPollingRateSeconds * 1000;
                }

                // Do all initialisation needed - if it's a bootup sequence OR Settings is changed
                logger.Info($"On Start Sequence = {onstartSequence}, isSettingsChanged = {isSettingsChanged}");
                if (onstartSequence || isSettingsChanged)
                {
                    if (!onstartSequence)
                    {
                        // This is not part of a startup sequence
                        // Which means this is a settings change sequence.
                        // So stop the existing timer
                        logger.Info("Let's Stop the current Timer");
                        PollingTimer.Stop();
                    }

                    logger.Info($"Initiliasing Timer");
                    // We need a delayed start for reading data. It's DelayedStartForMinuteAlignment.
                    WaitForTimeAlignment();
                    InitializeTimer();
                    if (onstartSequence)
                    {
                        // Subscribe for Refresh Message. There is some reason why it done here. In early releases on collect, refreshneeded
                        // message was a retained message. It's still retined by rabbitmq in some machines. So now we ar esubscribing 
                        // to the refresshneeded topic as late as possible to avoid some excpetions when Collect service starts. 
                        messageWrapper.Subscribe(
                            MqttCommonConstants.CollectIsServiceUpdateNeeded,
                            new Tuple<CallbackDelegate, object>(RefreshMessageHandler, this),
                            MessageDataType.String,
                            false
                            );

                        // Subscribe to Pause writing to TSDB message
                        messageWrapper.Subscribe(
                            MqttCommonConstants.CollectPauseWriteToDB,
                            new Tuple<CallbackDelegate, object>(CollectPauseWriteToDBMessageHandler, this),
                            MessageDataType.String,
                            false
                            );

                        // Subscribe to Resume writing to TSDB message
                        messageWrapper.Subscribe(
                            MqttCommonConstants.CollectResumeWriteToDB,
                            new Tuple<CallbackDelegate, object>(CollectResumeWriteToDBMessageHandler, this),
                            MessageDataType.String,
                            false
                            );

                        // Subscribe to all devices and tags data send by Collect Web server.
                        messageWrapper.Subscribe(
                            MqttCommonConstants.CollectAllTagData,
                            new Tuple<CallbackDelegate, object>(HandleAllDeviceTagsMessage, this),
                            MessageDataType.String,
                            false
                            );

                        //Device registration
                        string topicForDeviceReg = MqttCommonConstants.CollectServiceDeviceRegistration;
                        string collectDeviceRegistrationMessage = DeviceRegistration.Replace("'", "\"");
                        logger.Debug("About to publish." +
                                     $"CollectServiceDeviceRegistration={collectDeviceRegistrationMessage};topicForDeviceReg={topicForDeviceReg}");
                        messageWrapper.PublishData(collectDeviceRegistrationMessage, topicForDeviceReg, null, MessageDataType.String, true);

                        //Tag registration
                        string topicForTagReg = MqttCommonConstants.CollectServiceTagRegistration;
                        string collectTagRegistrationMessage = TagRegistration.Replace("'", "\"");
                        logger.Debug("About to publish." +
                                     $"CollectServiceDeviceRegistration={collectTagRegistrationMessage};topicForTagReg={topicForTagReg}");
                        messageWrapper.PublishData(collectTagRegistrationMessage, topicForTagReg, null, MessageDataType.String, true);
                    }
                }
                else {
                    logger.Info($"Skipping Re Initialising Timer, since this NOT On Start sequence & settings is NOT changed");
                }
            }

            catch (Exception ex)
            {
                logger.Info($"Initialise Failed. Exception : {ex.ToString()}");
                return false;
            }
            return true;
        }

        protected void OnStart(string[] args)
        {
            try
            {
                logger.Error("Starting Collect Service.");
                var Mqttaddress = string.IsNullOrEmpty(BrokerUrl) ?
                                         MqttCommonConstants.DefaultIPAddress : BrokerUrl;

                // This is used for getting settings
                messageWrapper = new MessageWrapper(Mqttaddress);
                logger.Info("Created MQTT & MessageWrappers");

                // Passing true, since this is a bootup sequence 
                Initialize(true);
                logger.Info("Completed Initialisation");

            }
            catch (Exception exception)
            {
                logger.Error("{0} || {1}", "Exception occured while starting Collect Service", exception);
            }
        }


        private void SendAckForUpdate()
        {
            logger.Debug($"Start");
            try
            {
                string topicForAck = MqttCommonConstants.CollectServiceUpdatedAcknowledgment;
                string collectDataUpdatedMessage = DeviceSignature;
                logger.Debug("About to publish." +
                             $"collectDataUpdatedMessage={collectDataUpdatedMessage};topicForAck={topicForAck}");
                // Here don't set isretained as true.
                messageWrapper.PublishData(collectDataUpdatedMessage, topicForAck, null, MessageDataType.String, false);
            }
            catch (Exception ex)
            {
                logger.Debug($" Error. {ex.ToString()}");
            }
            logger.Debug($"End");
        }

        private void stopThreads()
        {
            try
            {

                if (DeviceManager != null && DeviceManager.Threads != null)
                {
                    logger.Debug($"Number of threads in DeviceManager.threads {DeviceManager.Threads}");
                    foreach (var thread1 in DeviceManager.Threads)
                    {
                        thread1.Abort();
                        logger.Debug($"Thread with Name({thread1.Name}) aborted.");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error in stopThreads");
            }


        }
        void OnStop()
        {
            try
            {
                stopThreads();
                PollingTimer.Stop();
                messageWrapper.Disconnect();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error in OnStop");
            }

            logger.Error("Collect-x service stopped");
        }

        private void RefreshMessageHandler(string topic, string replyTo, dynamic message)
        {
            try
            {
                string strContent = Convert.ToString(message);
                logger.Info($"Inside Call back function of MQTT. Topic : {topic} Content : {strContent}");
                logger.Info("A fresh Initialisation of Timers");
                // Since this is not an On Start seqeunce, pass false
                Initialize(false);

                logger.Info("Setting UpdateNeeded to true");
                IsCollectServiceUpdateNeeded = true;
        }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        /// <summary>
        /// Handler for receiving the device and tag information from Collect Web Server.
        /// </summary>
        /// <param name="topic"></param>
        /// <param name="replyTo"></param>
        /// <param name="message"></param>
        private void HandleAllDeviceTagsMessage(string topic, string replyTo, dynamic message)
        {
            try
            {
                string strContent = Convert.ToString(message);
                //When a new message is received, the value is assigned to DeviceManager.AllDevicesAndTagsJson property as below.
                //IsCollectServiceUpdateNeeded set to true so that this value will be used to generate the new set of Device and tags 
                //when the next PollingTimerTickHandler handler is fired.
                DeviceManager.AllDevicesAndTagsJson = strContent;
                logger.Info($"All Device and Tags message received: {Environment.NewLine}{strContent}");

                // Since this is not an On Start seqeunce, pass false
                Initialize(false);

                logger.Info("Setting IsCollectServiceUpdateNeeded to true");
                IsCollectServiceUpdateNeeded = true;
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        private void CollectPauseWriteToDBMessageHandler(string topic, string replyTo, dynamic message)
        {
            try
            {
                string strContent = Convert.ToString(message);
                // Since this is not an On Start seqeunce, pass false
                Initialize(false);

                logger.Info("Pausing write to DB. Setting PauseWriteToDB to true");
                PauseWriteToDB = true;
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        private void CollectResumeWriteToDBMessageHandler(string topic, string replyTo, dynamic message)
        {
            try
            {
                string strContent = Convert.ToString(message);
                // Since this is not an On Start seqeunce, pass false
                Initialize(false);

                logger.Info("Resuming write to DB. Setting PauseWriteToDB to false");
                PauseWriteToDB = false;
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

        private void InitializeComponent()
        {
            try
            {
                this.ServiceName = CommonConstants.CollectServiceName;
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }
    }
}
