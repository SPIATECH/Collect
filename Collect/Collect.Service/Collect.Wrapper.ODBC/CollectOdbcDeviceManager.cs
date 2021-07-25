//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.DataAccess.RDBMS;
using Collect.DataAccess.TSDB;
using Collect.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Collect.Wrapper.ODBC
{
    public class CollectOdbcDeviceManager : ICollectServiceDeviceManager
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        public List<Thread> Threads { get; set; }
        public List<ICollectServiceDeviceWrapper> Devices { get; set; }
        public string TsdbConString { get; set; }
        public string TsdbUsername { get; set; }
        public string TsdbPassword { get; set; }
        public string AllDevicesAndTagsJson { get; set; }

        public static string RealTimeRP_Minute;
        public static string RealTimeRP_Hour;
        public static string RealTimeRP_Second;
        public static string HistoricalRP_Minute;
        public static string HistoricalRP_Hour;
        public static string HistoricalRP_Second;
        public static string Tsdb;
        public static string UserName;
        public static string Password;
        public CollectOdbcDeviceManager()
        {
            TsdbConString = Tsdb;
            logger.Debug("tsdbConString", TsdbConString);
            TsdbUsername = UserName;
            logger.Debug("tsdbUsername", TsdbUsername);
            TsdbPassword = Password;
            logger.Debug("tsdbPassword", TsdbPassword);
            Threads = new List<Thread>();
            Devices = new List<ICollectServiceDeviceWrapper>();

            InitilizeTSDB();
            GetListofDevices();
        }

        private void InitilizeTSDB()
        {
            try
            {
                var task = new CollectTsdbInit(TsdbConString, TsdbUsername, TsdbPassword,RealTimeRP_Hour, RealTimeRP_Minute,RealTimeRP_Second ,
                                               HistoricalRP_Hour, HistoricalRP_Minute, HistoricalRP_Second).initTSDB();
                logger.Debug("TSDB Write Status=" + task.Status);
                logger.Info("**Initialize TSDB**");
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Initialize TSDB Failed**", ex);
            }
        }

        public void GetListofDevices()
        {
            logger.Debug("LoadList Device List is the next thing.");
            List<CollectDeviceModel> pluginModelList = new CollectDeviceRepository().GetDeviceModelListFromDB(0, "ODBC");
            logger.Debug($"No. of Devices loaded from DB : {pluginModelList.Count}");
            List<CollectOdbcDevice> deviceModelList = new List<CollectOdbcDevice>();
            foreach (var item in pluginModelList)
            {
                CollectOdbcDevice odbcDev = new CollectOdbcDevice();
                odbcDev.DeviceId = item.DeviceId;
                odbcDev.DeviceType = item.DeviceType;
                odbcDev.Name = item.DeviceName;

                odbcDev.Dsn = item.Details.GetValue("DSN");
                odbcDev.TableName = item.Details.GetValue("TableName");
                odbcDev.ValueColumn = item.Details.GetValue("ValueColumnName");
                odbcDev.DateColumn = item.Details.GetValue("DateColumnName");
                odbcDev.IdColumn = item.Details.GetValue("IdColumn");
                deviceModelList.Add(odbcDev);
                logger.Debug("===============================");
                logger.Debug($"\n CollectOdbcDevice DeviceID = {odbcDev.DeviceId}\n DeviceType = {odbcDev.DeviceType}\n Name={odbcDev.Name}");
                logger.Debug("===============================");
            }
            Devices = deviceModelList.Select(dev => new CollectOdbcDeviceWrapper(dev as ICollectServiceDevice)).ToList<ICollectServiceDeviceWrapper>();
            logger.Debug("Next is threads");
            logger.Debug($"Threads initialized with devices.Count ===>>> {Devices.Count}");
        }

        /// <summary>
        /// Run threads for each devices
        /// </summary>
        public void UpdateAllDeviceTags(bool isHistorical)
        {
            try
            {
                //Initilizing new thread for each device
                logger.Info("**UpdateAllDeviceTags Started**");

                for (int i = 0; i < Devices.Count; i++)
                {
                    Threads[i] = new Thread(new ParameterizedThreadStart(Devices[i].UpdateTagValue));
                    Threads[i].Name = Devices[i].DeviceModel.DeviceId.ToString();
                }

                foreach (Thread thread in Threads)
                {
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
    }
}
