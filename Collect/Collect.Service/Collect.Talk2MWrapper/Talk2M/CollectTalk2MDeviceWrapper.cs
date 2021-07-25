//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.DataAccess.RDBMS;
using Collect.DataAccess.TSDB;
using Collect.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using Common.Models;
using Flurl;
using Talk2mProperties;
using System.IO;
using Microsoft.CSharp.RuntimeBinder;
using System.Net;
using System.Configuration;
using Common.LiteDB;
using Common.Utils.Models;
using System.Globalization;
using Common.Utils.InternetConnection;

namespace Collect.Talk2MWrapper
{
    public class CollectTalk2MDeviceWrapper : ICollectServiceDeviceWrapper
    {
        #region Properties

        public ICollectServiceDevice DeviceModel { get; set; }

        #endregion Properties

        #region Members

        public DateTime PollTime { get; set; }
        public DateTime HistoricalPollTime { get; set; }

        #endregion Members

        SettingsRepository<SettingsModel> settingsRepository = new SettingsRepository<SettingsModel>(CollectCommonConstants.talk2M_DB_Path, CollectCommonConstants.talk2M_DBName);
        SettingsModel talk2MSetting = new SettingsModel();
        private readonly Logger logger = LogManager.GetCurrentClassLogger();        
        public static string Tsdb;
        public static string Username;
        public static string Password;
        private readonly CollectTsdb tsdb = new CollectTsdb(Username,Password,Tsdb);

        public string Talk2MDevId;
        public string Talk2MAccountId;
        public string Talk2MAccount;
        public string Talk2MUsername;
        public string Talk2MPassword;
        public string Talk2MIsAccountRefreshNeeded;

        /// <summary>
        /// Get tag details for a particular device
        /// </summary>
        ///
        /// <param name="retryCount"></param>
        /// <param name="iPAddress"></param>
        /// <param name="slaveId"></param>
        /// <param name="name"></param>
        /// <param name="id"></param>
        /// <param name="Port"></param>
        public CollectTalk2MDeviceWrapper(string name, Guid deviceId, string deviceDetail, string accountId, string accountName, string devID, string userName, string password, string isAccountRefreshNeeded)
        {

            try
            {
                talk2MSetting.Id = getTalk2MKey(accountName,devID);
                talk2MSetting.DisplayName = CollectCommonConstants.talk2M_Id;

                DeviceModel = new CollectTalk2MDevice(name, deviceId, deviceDetail, accountId, accountName, devID, userName, password, isAccountRefreshNeeded);

                Talk2MAccountId = accountId;
                Talk2MAccount = accountName;
                Talk2MDevId = devID;
                Talk2MUsername = userName;
                Talk2MPassword = password;
                Talk2MIsAccountRefreshNeeded = isAccountRefreshNeeded;

                List<CollectTagModel> pluginModelList = new CollectTagRepository().GetTagModelList(deviceId);

                foreach (var item in pluginModelList)
                {
                    CollectTalk2MTag t = new CollectTalk2MTag()
                    {
                        TagId = item.TagId,
                        TagName = item.TagName,
                        Talk2MTagId = int.Parse(item.Details.GetValue("Talk2mTagId")),
                        Datatype = item.Details.GetValue("Datatype"),
                        EwonTagId = int.Parse(item.Details.GetValue("EwonTagId")),
                        Device = DeviceModel
                    };

                    logger.Debug("===============================");
                    logger.Debug($"\n TagID= {t.TagId}\n TagName= {t.TagName}\n" +
                        $"\n Talk2MTagId = {t.Talk2MTagId} \n Datatype = {t.Datatype}\n EwonTagId = {t.EwonTagId}");
                    logger.Debug("===============================");
                    DeviceModel.Tags.Add(t);
                }

    }
            catch (Exception retrieve)
            {
                logger.Error("{0} || {1}", "**Tag Loading Failed**", retrieve);
            }
        }


        public string getTalk2MKey(string accountName, string devId)
        {
            string talk2MKey = CollectCommonConstants.talk2M_Id + accountName + CollectCommonConstants.KeySeparator + devId;
            return talk2MKey;
        }

        /// <summary>
        /// 1. Call the function to read from different type of registers
        /// 2. Call the function to Assign register values in an array to a tag
        /// 3. Call the function to Write Tag values to InfluxDB
        /// </summary>
        public void UpdateTagValue(object isHistorical)
        {
            loadTalk2MData((bool)isHistorical);          
        }

        /// <summary>
        /// To load Talk2M data and write to TSDB
        /// </summary>
        /// <param name="isHistorical"></param>
        public void loadTalk2MData(bool isHistorical)
        {
            try
            {
                if (!InternetAvailability.IsInternetAvailable())
                {
                    logger.Info("No Internet Available!Please try later");
                    return;
                }
              
                logger.Info($"Account Information.AccountId:{Talk2MAccountId}, DevId:{Talk2MDevId}, UserName:{Talk2MUsername}, Password:{Talk2MPassword}, Talk2MAccountRefreshNeeded:{Talk2MIsAccountRefreshNeeded}");

                if (Talk2MIsAccountRefreshNeeded == bool.TrueString)
                {
                    logger.Info("Talk2M account refreshed. Clearing TransactionId");
                    talk2MSetting.Value = CollectCommonConstants.AccountRefreshNeeded;
                    settingsRepository.Write(talk2MSetting);
                    Talk2MIsAccountRefreshNeeded = bool.FalseString;

                    CollectAccountModel accountModel = new CollectAccountModel();
                    accountModel.AccountId = new Guid(Talk2MAccountId);
                    accountModel.Details.SetValue("DeveloperId", Talk2MDevId);
                    accountModel.Details.SetValue("UserName", Talk2MUsername);
                    accountModel.Details.SetValue("Password", Talk2MPassword);
                    accountModel.Details.SetValue("IsAccountRefreshNeeded", bool.FalseString);

                    new CollectAccountRepository().SaveOrUpdateAccount(accountModel, true, true); //Adding account to database
                    return;
                }

                string id = getTalk2MKey(Talk2MAccount, Talk2MDevId);

                logger.Info($"Id:{id}");
               
                logger.Info("Internet Available");

                using (var webClient = new MyWebClient())
                {
                    logger.Info("Collecting the latest data from Talk2M");

                    bool moreDataAvailable;
                    int samplesCount = 0;
                    List<SettingsModel> talk2MInfo = settingsRepository.Read(id);
                    string transactionId = "";

                    if (talk2MInfo.Count != 0)
                    {                     
                        transactionId = talk2MInfo.FirstOrDefault(x => x.Id == id).Value.ToString();
                        if(transactionId == CollectCommonConstants.AccountRefreshNeeded)
                        {
                            transactionId = "";
                        }
                        logger.Info($"Previous transaction Id exist:{transactionId}");
                    }
                    else
                    {
                        logger.Info("No Previous transaction Id exist!");
                    }
                    
                    do
                    {
                        if (!InternetAvailability.IsInternetAvailable())
                        {
                            logger.Warn("No Internet Available!Please try later");
                            break;
                        }

                        var url = MyWebClient.BuildUrl("syncdata", new { createTransaction = "", lastTransactionId = transactionId });
                        var response = webClient.CallApi(url,Talk2MDevId,Talk2MAccount,Talk2MUsername,Talk2MPassword);
                        var data = DynamicJson.Parse(response);
                        transactionId = data.transactionId;

                        logger.Info($"Data received. transactionId = {transactionId}");

                        // Browse history of eWONs and tags
                        foreach (var ewon in data.ewons)
                        {
                            logger.Trace($"Ewon name:{ewon.name}");
                            if (DeviceModel.Name == ewon.name)
                            {
                                logger.Trace("Ewon exist in the device list");
                                foreach (var tag in ewon.tags)
                                {
                                    try
                                    {
                                        if (DeviceModel.Tags.Count > 0)
                                        {
                                            CollectTalk2MTag tagDetail = DeviceModel.Tags.FirstOrDefault(x => x.TagName == tag.name) as CollectTalk2MTag;
                                            if (tagDetail != null)
                                            {
                                                foreach (var sample in tag.history)
                                                {
                                                    logger.Trace($"ewon name:{ewon.name} , tag name: {tag.name} , date: {sample.date} , value: {sample.value}");
                                                    tagDetail.Value = sample.value;
                                                    DateTime dt = DateTime.ParseExact(sample.date.ToString(), CollectCommonConstants.talk2M_DateFormat, CultureInfo.InvariantCulture); 
                                                    WriteTSDB(dt, tag.name, isHistorical);
                                                    samplesCount++;
                                                }
                                            }
                                        }
                                    }
                                    catch (RuntimeBinderException)
                                    {   // Tag has no history. If it's in the transaction, it's most likely because it has alarm history
                                        logger.Error($"Tag {ewon.name}.{tag.name} has no history.");
                                    }
                                    catch(Exception ex)
                                    {
                                        logger.Error($"Tag {ewon.name}.{tag.name} caused exception.{ex}");
                                    }
                                }
                            }
                        }

                        logger.Debug($"{0} samples written to disk", samplesCount);

                        #region To Flush or Delete Data from Talk2M Server based on Transaction Id
                        // Flush data received in this transaction
                        //if (Properties.Settings.Default.DeleteData)
                        //{
                        //    logger.Debug("Flushing received data from the DataMailbox...");
                        //    url = BuildUrl("delete", new { transactionId = transactionId });
                        //    webClient.CallApi(url);
                        //    logger.Debug("DataMailbox flushed.");
                        //}
                        #endregion To Flush or Delete Data from Talk2M Server based on Transaction Id
                        //save the transaction id for next run of this program
                        talk2MSetting.Value = transactionId;
                        settingsRepository.Write(talk2MSetting);
                        // Did we receive all data?
                        try
                        {
                            moreDataAvailable = data.moreDataAvailable;
                        }
                        catch (RuntimeBinderException)
                        {	
                            // The moreDataAvailable flag is not specified in the server response
                            moreDataAvailable = false;
                        }
                        if (moreDataAvailable)
                        {
                            logger.Trace("There's more data available. Let's get the next part...");
                        }
                        else
                        {
                            logger.Trace("No new data available!");
                        }
                    }
                    while (moreDataAvailable);

                }
            }
            catch (WebException ex)
            {
                logger.Error($"Web Exception!! Talk2M read Error! {ex.Message}");
            }
            catch (Exception ex)
            {
                logger.Error($"Talk2M exception:{ex.Message}");
                logger.Error("Details:"+ex);
            }
        }

        /// <summary>
        /// Write each tag item to InfluxDB
        /// </summary>
        private void WriteTSDB(DateTime pt, string tagName, bool isHistorical)
        {
            try
            {
                ICollectServiceTag tagDetail = DeviceModel.Tags.FirstOrDefault(x => x.TagName == tagName);
                    if (tagDetail.Value != null)
                    {
                        var stopwatch = new Stopwatch();
                        stopwatch.Start();

                        tsdb.InsertTSDB(tagDetail, pt, isHistorical);

                        stopwatch.Stop();
                        var timeForInsertTSDB = stopwatch.Elapsed.TotalMilliseconds;
                        logger.Info($"timeForInsertTSDB in (ms): {timeForInsertTSDB}");
                    }
            }
            catch (Exception tsdbEx)
            {
                logger.Error("{0} || {1}", "**Write to TSDB failed**", tsdbEx);
            }
        }

        /// <summary>
        /// Write each tag item to Historical InfluxDB
        /// </summary>
        public void WriteHistoricalTSDB()
        {
            try
            {
                HistoricalPollTime = DateTime.UtcNow;
                foreach (var tagItems in DeviceModel.Tags)
                {
                    if (tagItems.Value != null)
                    {
                        var stopwatch = new Stopwatch();
                        stopwatch.Start();

                        tsdb.InsertTSDB(tagItems, PollTime, true);

                        stopwatch.Stop();
                        var timeForInsertTSDB = stopwatch.Elapsed.TotalMilliseconds;
                        logger.Info($"timeForInsertTSDB in (ms): {timeForInsertTSDB}");
                    }
                }
            }
            catch (Exception tsdbEx)
            {
                logger.Error("{0} || {1}", "**Write to Historian TSDB failed**", tsdbEx);
            }
        }
    }
}
