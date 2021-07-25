//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using Collect.DataAccess.MQTT;
using Collect.DataAccess.RDBMS;
using Collect.Wrapper.ODBC;
using NLog;
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Versioning;
using System.ServiceProcess;
using System.Timers;

namespace Collect.Service.ODBC
{
    public partial class CollectServiceOdbc : ServiceBase
    {
        private Logger logger = LogManager.GetCurrentClassLogger();
        private CollectOdbcDeviceManager DeviceManager;
        private Timer refreshTimer { get; set; }
        private string xmlTagData = string.Empty;
        private CollectTagRepository tagRepository = new CollectTagRepository();
        private int sampleCount = 0;
        private int tickCount = 0;
        private string buildNumber;
        private string version;

        private void RefreshTimer_Tick(object sender, ElapsedEventArgs e)
        {
            logger.Trace($"No of threads running : {System.Diagnostics.Process.GetCurrentProcess().Threads.Count}");
            logger.Trace("RefreshTimer_Tick is hit");
            logger.Trace(tickCount);
            tickCount++;
            bool isHistorical = false;
            try
            {
                logger.Trace("Started Updating Tags");
                if (tickCount == sampleCount)
                {
                    isHistorical = true;
                    tickCount = 0;
                }

                DeviceManager.UpdateAllDeviceTags(isHistorical);

                logger.Trace("Updating Tags Completed");
            }
            catch (Exception tim)
            {
                logger.Error("{0} || {1}", "**Timer failed**", tim);
            }
        }

        private void InitilizeTimer()
        {
            bool isValid = true;
            try
            {
                double realtimeTimerValue;
                double.TryParse((ConfigurationManager.AppSettings["PollingRate"]), out realtimeTimerValue);
                logger.Trace($"realtimeTimerValue: {realtimeTimerValue}");
                double historicalTimerValue;
                double.TryParse(ConfigurationManager.AppSettings["LoggingRate"], out historicalTimerValue);

                if (realtimeTimerValue < 1000 || historicalTimerValue < 1000 ||
                        historicalTimerValue < realtimeTimerValue || historicalTimerValue % realtimeTimerValue > 0)
                {
                    isValid = false;
                }
                else
                {
                    sampleCount = Convert.ToInt32(historicalTimerValue / realtimeTimerValue);
                }

                if (isValid == true && sampleCount > 0)
                {
                    refreshTimer = new Timer(realtimeTimerValue);

                    refreshTimer.Elapsed += RefreshTimer_Tick;
                    refreshTimer.Enabled = true;
                }
                else
                {
                    logger.Error("Invalid Time value in Config File. Kindly check logging and polling rates.");
                }
            }
            catch (Exception ex)
            {
                logger.Error("{0} || {1}", "**Error initializing timers**", ex);
            }
        }

        #region Service Methods

        public CollectServiceOdbc()
        {
            try
            {
                InitializeComponent();
                logger.Error(Environment.NewLine + Environment.NewLine);
                logger.Error("**CollectODBCService**");

                //Code to print the target framework of the application.
                var targetFw = Assembly.GetExecutingAssembly().GetCustomAttributes(typeof(TargetFrameworkAttribute), false);
                TargetFrameworkAttribute targetFramework = targetFw[0] as TargetFrameworkAttribute;
                var fwAsString = string.Empty;
                if (targetFramework != null)
                {
                    fwAsString = targetFramework.FrameworkDisplayName;
                }
                logger.Error($"Target framework of the applciation is : {fwAsString}");

                //We use AssemblyDescriptionAttribute in AssemblyInfo.cs to pass the buildnumber as string.
                if (AssemblyDescriptionAttribute.IsDefined(Assembly.GetExecutingAssembly(), typeof(AssemblyDescriptionAttribute)))
                {
                    //if there is, get attribute of desired type
                    AssemblyDescriptionAttribute a = (AssemblyDescriptionAttribute)AssemblyDescriptionAttribute.GetCustomAttribute(
                                                                    Assembly.GetExecutingAssembly(), typeof(AssemblyDescriptionAttribute));
                    this.buildNumber = a.Description;
                }

                if (AssemblyVersionAttribute.IsDefined(Assembly.GetExecutingAssembly(), typeof(AssemblyVersionAttribute)))
                {
                    //if there is, get attribute of desired type
                    AssemblyVersionAttribute v = (AssemblyVersionAttribute)AssemblyVersionAttribute.GetCustomAttribute(
                                                                    Assembly.GetExecutingAssembly(), typeof(AssemblyVersionAttribute));
                    this.version = v.Version;
                }
                if (string.IsNullOrWhiteSpace(this.version) == true)
                {
                    this.version = "0.2";
                }
                logger.Error($"Version: {version}.{buildNumber}");

                logger.Error($"Application Configuration");
                string appConf = "" + Environment.NewLine;
                foreach (var key in ConfigurationManager.AppSettings.AllKeys)
                {
                    appConf += key + " = " + ConfigurationManager.AppSettings[key] + Environment.NewLine;
                }
                logger.Error($"{appConf}");
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error in constructor");
            }
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                logger.Error("OnStart method called in Collect ODBC Service");

                DeviceManager = new CollectOdbcDeviceManager();

                InitilizeTimer();

                logger.Trace("Assuming the data needed by ActiveUI is published in either Common service or ModbusTCP service. So both this and that common service must be restarted.");
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error in Service Start");
            }
        }

        protected override void OnStop()
        {
            try
            {
                refreshTimer.Enabled = false;
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error in OnStop");
            }

            logger.Error("Collect service stopped");
        }

        #endregion Service Methods
    }
}
