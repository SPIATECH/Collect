//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Mqtt;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Common.Models;
using System.Configuration;
using NLog;
using System.Threading;
using Common.Utils.Models;
using System.IO;

namespace Collect.Master.Service
{
    public partial class CollectMasterServer : ServiceBase
    {
        private MessageWrapper messageWrapper;
        //private string tsdbUsername;
        //private string tsdbPassword;
        //private string tsdbConnectionString;
        private string BrokerUrl;
        private string tagData = string.Empty;
        private bool isLaunchWebServer = false;
        private bool isLaunchInfluxdb = false;
        private List<string> appsToRun = new List<string>();

        private Logger logger = LogManager.GetLogger(CollectCommonConstants.DefaultLoggerName);

        public CollectMasterServer()
        {
            try
            {
                logger.Info("Initializing Collect-x-MasterService");
                InitializeComponent();
                //tsdbUsername = tsdbConstants.tsdbWriteUsername;
                //tsdbPassword = tsdbConstants.tsdbWritePassword;
                CollectMasterServiceConfiguration cnf = new CollectMasterServiceConfiguration();

                Utils.ConfigureLoggerLevel(CollectMasterServiceConfiguration.LogLevel);
                logger.Info("Logger Level Reconfiguration Done");

                //tsdbConnectionString = CollectMasterServiceConfiguration.TsdbServer;
                BrokerUrl = CollectMasterServiceConfiguration.BrokerUrl;
                isLaunchWebServer = CollectMasterServiceConfiguration.LaunchWebServer;
                isLaunchInfluxdb = CollectMasterServiceConfiguration.LaunchInfluxDb;
                //AdoHelper.ConnectionString = CollectMasterServiceConfiguration.ConnectionString;
                //logger.Info($"Ado Helper Connection String = {AdoHelper.ConnectionString}");
                logger.Info($"LaunchWebServer flag in config = {isLaunchWebServer}");
                logger.Info($"LaunchInfluxdb flag in config = {isLaunchInfluxdb}");
                logger.Info("Initializing Collect-x-MasterService Completed");

                string rootPath = Environment.GetEnvironmentVariable("SPIAI4SUITEINSTALLDIR");
                logger.Info($"Install path (rootpath) = {rootPath}");

                logger.Info($"Executables to run = {CollectMasterServiceConfiguration.AppsToRun}");
                appsToRun = CollectMasterServiceConfiguration.AppsToRun.Split(',').ToList();
            }
            catch (Exception ex)
            {
                logger.Error("Collect-x-MasterService Initializing failed:" + ex);
            }
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                logger.Info("Starting Collect-x MasterService");
                var Mqttaddress = string.IsNullOrEmpty(BrokerUrl) ?
                                             MqttCommonConstants.DefaultIPAddress : BrokerUrl;

                // This is used for getting settings
                messageWrapper = new MessageWrapper(Mqttaddress);

                //messageWrapper.Subscribe(
                //                MqttCommonConstants.CollectClearAllTag,
                //                new Tuple<CallbackDelegate, object>(ClearAllTagValuesMessageHandler, this),
                //                MessageDataType.String,
                //                false
                //                );

                messageWrapper.Subscribe(
                                MqttCommonConstants.CollectIsServiceUpdateNeeded,
                                new Tuple<CallbackDelegate, object>(RefreshMessageHandler, this),
                                MessageDataType.String,
                                false
                                );

                logger.Info($"LaunchWebServer flag in config = {isLaunchWebServer}");

                //Launch Collect Web Server based on the config value.
                if (isLaunchWebServer)
                {
                    //Start Collect Web Server
                    string fileName = Path.Combine(Utils.GetInstallFolder(), FilePaths.CollectWebServerPath, FilePaths.CollectWebServerStartupScript);
                    logger.Info($"Starting Collect WebServer. Path = {fileName}");
                    Utils.StartApp(fileName);
                }

                if (isLaunchInfluxdb)
                {
                    logger.Info("Starting influxdb.");
                    InfluxHelper.StartInfluxdb();
                }

                //Start Alert Manager
                string alertMgrFileName = Path.Combine(Utils.GetInstallFolder(), FilePaths.AlertManagerPath, FilePaths.AlertManagerStartupScript);
                logger.Info($"Starting Alert Manager. Path = {alertMgrFileName}");
                Utils.StartApp(alertMgrFileName);

                //Start CollectModbusTCPServer
                string modbusDriverFileName = Path.Combine(Utils.GetInstallFolder(), FilePaths.CollectModbusTCPServerPath, FilePaths.AppsStartupScriptName);
                logger.Info($"Starting Collect ModbusTCP Server. Path = {modbusDriverFileName}.");
                Utils.StartApp(modbusDriverFileName);

                //Launch Collect Apps
                if (appsToRun.Count > 0)
                {
                    logger.Debug($"Launching Collect Apps. Count= {appsToRun.Count}");
                    foreach (string exe in appsToRun)
                    {
                        string fileName = Path.Combine(Utils.GetInstallFolder(), FilePaths.CollectAppsPath, exe, FilePaths.AppsStartupScriptName);
                        logger.Info($"Starting App. Path = {fileName}");
                        Utils.StartApp(fileName);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error("Starting Collect-x MasterService Failed : " + ex);
            }
        }

        private async void ClearAllTagValuesMessageHandler(string topic, string replyTo, dynamic message)
        {
            string responseMessage = "";
            try
            {
                //string strContent = Convert.ToString(message);
                //logger.Info($"Inside ClearAllTagValuesMessageHandler. Topic : {topic} Content : {strContent}");
                //logger.Info("Clearing All Tag Values from Database");
                //CollectTsdb clearTag = new CollectTsdb(tsdbUsername, tsdbPassword, tsdbConnectionString);
                //await clearTag.ClearAllTagValues();

                //if (CollectTsdb.IsPurgeSuccessful)
                //{
                //    logger.Info("All Tag Values cleared from Database");
                //    responseMessage = CollectCommonConstants.clearTagValueSuccessMessage;
                //}
                //else
                //{
                //    logger.Info("Failed to clear all Tag Values from Database!");
                //    responseMessage = CollectCommonConstants.clearTagValueFailMessage;
                //}
            }
            catch (Exception ex)
            {
                logger.Error("Failed to clear All Tag values from database :" + ex);
                responseMessage = CollectCommonConstants.clearTagValueFailMessage;
            }
            messageWrapper.PublishData(responseMessage, MqttCommonConstants.CollectClearAllTagAcknowledgment, null, MessageDataType.String, false);
        }

        private void RefreshMessageHandler(string topic, string replyTo, dynamic message)
        {
            try
            {
                SendAckForRefresh();
            }
            catch (Exception ex)
            {
                logger.Error("Failed to clear All Tag values from database :" + ex);
            }
        }


        private void SendAckForRefresh()
        {
            logger.Debug($"Start");
            try
            {
                string topicForAck = MqttCommonConstants.CollectServiceUpdatedAcknowledgment;
                string Message = CollectCommonConstants.DeviceSignatureMaster;
                logger.Debug("About to publish." +
                             $"Message={Message};topicForAck={topicForAck}");
                // Here don't set isretained as true.
                messageWrapper.PublishData(Message, topicForAck);

                // For testing. Remove
                string rootPath = Environment.GetEnvironmentVariable("SPIAI4SUITEINSTALLDIR");
                logger.Info($"Install path (rootpath) = {rootPath}");
            }
            catch (Exception ex)
            {
                logger.Debug($"Error. {ex.ToString()}");
            }
            logger.Debug($"End");
        }

        protected override void OnStop()
        {
            if (appsToRun.Count > 0)
            {
                logger.Debug($"Stopping Collect Apps. Count: {appsToRun.Count}");
                Utils.StopApplications(appsToRun);
            }

            logger.Debug($"Adding application names to list of apps to stop.");
            List<string> applicationNames = new List<string>();

            //AlertManager should be stopped.
            applicationNames.Add(AppNameConstants.AlertManagerName);
            //CollectModTCPServer should be stopped.
            applicationNames.Add(AppNameConstants.CollectModTCPServerName);

            //Collect Web Server
            if (isLaunchWebServer)
            {
                applicationNames.Add(AppNameConstants.CollectWebServerName);
            }

            //Infllux db
            if (isLaunchInfluxdb)
            {
                applicationNames.Add(InfluxConstants.InfluxDBProcessName);
            }

            if (applicationNames.Count > 0)
            {
                logger.Info($"Stopping applications. Count: {applicationNames.Count}");
                Utils.StopApplications(applicationNames);
            }


            messageWrapper.Disconnect();

            logger.Info("Collect-x MasterService stopped");
        }
    }
}
