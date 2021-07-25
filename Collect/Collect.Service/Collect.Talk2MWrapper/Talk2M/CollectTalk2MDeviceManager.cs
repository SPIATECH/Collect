//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.DataAccess.RDBMS;
using Collect.DataAccess.TSDB;
using Collect.Models;
using Common.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading;

namespace Collect.Talk2MWrapper
{
    /// <summary>
    /// This is CollectTalk2MDeviceManager.
    /// </summary>
    public class CollectTalk2MDeviceManager : ICollectServiceDeviceManager
    {
        public List<Thread> Threads { get; set; }

        /// <summary>
        /// List of Tuple[DeviceId, skipCount]
        /// </summary>
        internal Dictionary<Guid, int> threadSkipDict { get; set; }

        internal int threadSkipWarnCount { get; set; }
        private System.Timers.Timer refreshTimer { get; set; }
        public List<ICollectServiceDeviceWrapper> Devices { get; set; }
        public string TsdbConString { get; set; }
        public string TsdbUsername { get; set; }
        public string TsdbPassword { get; set; }
        public string AllDevicesAndTagsJson { get; set; }

        private readonly Logger logger = LogManager.GetCurrentClassLogger();
        public static int CountNeeded;
        public static string Connection;
        public static string UserName;
        public static string Password;
        public static string RealTimeRP_Hour;
        public static string RealTimeRP_Minute;
        public static string RealTimeRP_Second;
        public static string HistoricalRP_Hour;
        public static string HistoricalRP_Minute;
        public static string HistoricalRP_Second;

        public CollectTalk2MDeviceManager()
        {
           
            TsdbConString = Connection;
            TsdbUsername = UserName;
            TsdbPassword = Password;
            threadSkipWarnCount = CountNeeded;

            threadSkipDict = new Dictionary<Guid, int>();

            InitilizeTSDB();
            GetListofDevices();
        }

        private void InitilizeTSDB()
        {
            try
            {
                var task = new CollectTsdbInit(TsdbConString, TsdbUsername, TsdbPassword,RealTimeRP_Hour,
                                              RealTimeRP_Minute,RealTimeRP_Second,HistoricalRP_Hour,HistoricalRP_Minute,HistoricalRP_Second).initTSDB();
                logger.Debug("TSDB Write Status=" + task.Status);
                logger.Info("**Initialize TSDB**");
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Initialize TSDB Failed**", ex);
            }
        }

        /// <summary>
        /// Get device details and put it in a list
        /// </summary>
        public void GetListofDevices()
        {
            logger.Debug("GetListofDevices start");
            try
            {
                List<CollectDeviceModel> pluginModelList = new CollectDeviceRepository().GetDeviceModelListFromDB(0,  CollectCommonConstants.DeviceSignatureTalk2M);
                logger.Info($"pluginModelList loaded: {pluginModelList.Count}");
                List<CollectTalk2MDevice> deviceModelList = new List<CollectTalk2MDevice>();

                foreach (var item in pluginModelList)
                {
                    CollectTalk2MDevice talk2MDev = new CollectTalk2MDevice();
                    if (item.DeviceType.ToUpper() == CollectCommonConstants.DeviceSignatureTalk2M.ToUpper())
                    {
                        talk2MDev.DeviceId = item.DeviceId;
                        talk2MDev.DeviceDetail = item.Details.GetValue("DeviceDetail");
                        talk2MDev.Name = item.DeviceName;
                        talk2MDev.DeviceType = item.DeviceType;
                        talk2MDev.Talk2MAccountId = item.Details.GetValue("AccountId");
                        talk2MDev.Talk2MAccount = item.Details.GetValue("AccountName");
                        talk2MDev.Talk2MDevId = item.Details.GetValue("DeveloperId");
                        talk2MDev.Talk2MUsername = item.Details.GetValue("UserName");
                        talk2MDev.Talk2MPassword = item.Details.GetValue("Password");
                        talk2MDev.Talk2MIsAccountRefreshNeeded = item.Details.GetValue("IsAccountRefreshNeeded");
                        deviceModelList.Add(talk2MDev);
                        logger.Debug("===============================");
                        logger.Debug($"\n DeviceID = {talk2MDev.DeviceId}\n" +
                            $"\n DeviceName={talk2MDev.Name}\n DeviceType={talk2MDev.DeviceType}\n EwonId={talk2MDev.DeviceDetail} \n Account={talk2MDev.Talk2MAccount}\n" +
                            $"DeveloperId={talk2MDev.Talk2MDevId}\nUsername={talk2MDev.Talk2MUsername}\nPassword={talk2MDev.Talk2MPassword}\nIsAccountRefreshNeeded={talk2MDev.Talk2MIsAccountRefreshNeeded}");
                        logger.Debug("===============================");
                    }
                }

                Devices = new List<ICollectServiceDeviceWrapper>();
                
                Devices = deviceModelList.Select(dev => new CollectTalk2MDeviceWrapper
                (
                      dev.Name,
                      dev.DeviceId,
                      dev.DeviceDetail,
                      dev.Talk2MAccountId,
                      dev.Talk2MAccount,
                      dev.Talk2MDevId,
                      dev.Talk2MUsername,
                      dev.Talk2MPassword,
                      dev.Talk2MIsAccountRefreshNeeded
                )).ToList<ICollectServiceDeviceWrapper>();

                logger.Debug($"CollectTalk2MDevices (Count: {Devices.Count} updated.");
                Threads = new List<Thread>();
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Get list of devices Failed**", ex);
            }
            logger.Debug("GetListofDevices End");
        }

        /// <summary>
        /// Run threads for each devices
        /// </summary>
        public void UpdateAllDeviceTags(bool isHistorical)
        {
            try
            {
                logger.Debug("UpdateAllDeviceTags method started");
                int noOfThreads = Process.GetCurrentProcess().Threads.Count;
                logger.Debug($"Number of threads running is: {noOfThreads}");

                // Remove all finished threads
                List<Guid> listOfRunningThreads = Threads.Where(t => t.IsAlive).Select(x => Guid.Parse(x.Name)).ToList();
                List<Guid> listOfNotRunningThreads = Threads.Where(t => !t.IsAlive).Select(x => Guid.Parse(x.Name)).ToList();
                // Since these are not running, those wont be skipped
                foreach (var item in listOfNotRunningThreads)
                {
                    threadSkipDict.Remove(item);
                }
                // Loop for logging skipped threads
                foreach (var sk in listOfRunningThreads)
                {
                    int existingCount = 0;
                    threadSkipDict.TryGetValue(sk, out existingCount);
                    int newCount = existingCount + 1;
                    threadSkipDict[sk] = newCount;
                    var theDevAboutTobeSkipped = Devices.FirstOrDefault(x => x.DeviceModel.DeviceId == sk);
                    var theDevAboutTobeSkipped2 = (theDevAboutTobeSkipped == null) ? null : theDevAboutTobeSkipped.DeviceModel;
                    string devDetails = CollectSerializer.Serializer(theDevAboutTobeSkipped2);
                    if (threadSkipWarnCount > 0 && newCount > threadSkipWarnCount)
                    {
                        logger.Error($@"
=========================================
=========================================
=========================================
This device thread skipped for too many times (Skipped:{newCount}).
DeviceId:{sk.ToString()}
Details: {devDetails}
=========================================
=========================================
=========================================
");
                    }
                    else
                    {
                        logger.Warn($@"
=========================================
This device will be skipped since a thread is alrady running.
DeviceId:{sk.ToString()}
Details: {devDetails}
SkippedOfCount: {newCount}
=========================================
");
                    }
                }
                // Since these are not running, those should be removed. New threads are added later
                Threads.RemoveAll(t => !t.IsAlive);

                //Initilizing new thread for each device

                for (int i = 0; i < Devices.Count; i++)
                {
                    // Create new threads if corresponding threads not present

                    var theDevice = Devices[i];
                    var theDeviceId = theDevice.DeviceModel.DeviceId;
                    if (!listOfRunningThreads.Contains(theDeviceId))
                    {
                        var newThread = new Thread(new ParameterizedThreadStart(Devices[i].UpdateTagValue));
                        newThread.Name = theDeviceId.ToString();
                        Threads.Add(newThread);
                    }
                }

                foreach (Thread thread in Threads)
                {
                    if (!thread.IsAlive)
                        thread.Start(isHistorical);
                }
                logger.Info("**UpdateAllDeviceTags Completed**");
            }
            catch (ThreadStateException te)
            {
                logger.Error("{0} || {1}", "**Thread Exception**", te);
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**UpdateAllDeviceTags Failed**", ex);
            }
        }

        /// <summary>
        /// Run threads for each devices for Historical TSDB Write
        /// </summary>
        public void updateHistoricalTSDb()
        {
            try
            {
                foreach (var dev in Devices)
                {
                    new Thread(new ThreadStart(dev.WriteHistoricalTSDB)).Start();
                }
            }
            catch (Exception es)
            {
                logger.Error("{0} || {1}", "**WriteHistoricalTSDB failed**", es);
            }
        }
    }
}
