//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Models;
using Common.Utils.ConfigReadingCommon;
using NLog;
using NLog.Targets;
using NLog.Targets.Wrappers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Threading;
using System.Windows;
using System.Xml.Linq;

namespace Common.Utils.Models
{
    public static class Utils
    {

        //private static Logger logger = LogManager.GetCurrentClassLogger();
        private static Logger logger = LogManager.GetLogger(CollectCommonConstants.DefaultLoggerName);
        private static LogLevel loglevel = LogLevel.Info;

        public static bool IsManualGarbageCollector = false;

        /// <summary>
        /// This Method portnumber to MQTTBroker URL if and only if needed
        /// </summary>
        /// <param name="serverURL"></param>
        /// <param name="portNumber"></param>
        public static string AddPortNumber(string serverURL, string portNumber)
        {
            logger.Trace($" Started {serverURL}");
            try
            {
                logger.Debug($" Started");
                // If portnumber is not part of the server 
                if (serverURL.IndexOf(":") == -1)
                {
                    return $"{serverURL}:{portNumber}";
                }
                return serverURL;
            }
            catch (Exception ex)
            {
                logger.Error($"Failed {ex}, Message = {ex.Message}");
                return serverURL;
            }
        }



        /// <summary>
        /// This Method reads TrackingId from project
        /// </summary>
        /// <param name="projectlocation"></param>
        public static string ReadTrackingId(string projectlocation)
        {
            logger.Trace($"ReadingTrackingId Started from {projectlocation}");
            try
            {
                logger.Debug($"Reading TrackingId Started");
                string trackingid = Directory.GetFiles(projectlocation, CommonConstants.ProjectExtensionAll, SearchOption.AllDirectories)?.FirstOrDefault();

                if (trackingid != null)
                {
                    logger.Trace($"{trackingid}");
                    var data = XElement.Load(trackingid);
                    var xmlValue = data.Element(CommonConstants.TrackIdElement);
                    logger.Info($"Succefully read the current trackingid.{trackingid}");
                    return xmlValue.Value;
                }
                else
                {
                    logger.Error("Tracking ID was not available");
                    return null;
                }
            }
            catch (Exception ex)
            {
                logger.Error($"Failed to read TrackingId Error:{ex.Message}");
                return null;
            }
        }



        public static string GuessProgramFilesFolder()
        {
            if (IntPtr.Size == 8)
            {
                // 64 bit machine
                return FilePaths.ProgramFilesFolder;
            }
            else if (IntPtr.Size == 4)
            {
                // 32 bit machine
                return FilePaths.ProgramFilesFolderx86;
            }
            else
            {
                string msg = $"Invalid Intptr size = {IntPtr.Size}";
                logger.Error(msg);
                throw new Exception(msg);
            }
        }

        /// <summary>
        /// This function will get the install folder
        /// THis is needed when Install Direcotry can be chosen by user
        /// at the time is installation
        /// </summary>
        /// <returns></returns>
        public static string GetInstallFolder()
        {
            string installDir = Environment.GetEnvironmentVariable("SPIAI4SUITEINSTALLDIR");
            logger.Info($"Install Dir = {installDir}");
            return installDir;
        }

        /// <summary>
        /// This function will get the Influx DB Data Folder
        /// THis is needed when Install Direcotry can be chosen by user
        /// at the time is installation
        /// </summary>
        /// <returns></returns>
        public static string GetInfluxDataFolder()
        {

            string val = Environment.GetEnvironmentVariable("SPIAI4SUITEINFLUXDATADIR");
            logger.Info($"Influx Data Dir = {val}");
            return val;
        }

        /// <summary>
        /// This function will set Install Data folder to the Process
        /// THis is needed when Install Direcotry can be chosen by user
        /// at the time is installation
        /// </summary>
        /// <returns></returns>
        public static void SetInstallFolder(string val)
        {
            logger.Info($"value = {val}");
            Environment.SetEnvironmentVariable("SPIAI4SUITEINSTALLDIR", val, EnvironmentVariableTarget.Process);
            logger.Info("Install folder ENV = " + Utils.GetInstallFolder());
        }

        /// <summary>
        /// This function will set prodcut version Process
        /// THis is needed when Install Direcotry can be chosen by user
        /// at the time is installation
        /// </summary>
        /// <returns></returns>
        public static void SetProductVersion(string val)
        {
            logger.Info($"value = {val}");
            Environment.SetEnvironmentVariable("SPIAI4SUITEVERSION", val, EnvironmentVariableTarget.Process);
            logger.Info("version ENV = " + Utils.GetProductVersion());
        }



        /// <summary>
        /// This function will get product version set by the installer (msiexec)
        /// </summary>
        /// <returns></returns>
        public static string GetProductVersion()
        {
            string installDir = Environment.GetEnvironmentVariable("SPIAI4SUITEVERSION");
            logger.Info($"Product Version = {installDir}");
            return installDir;
        }

        public static string NanoPad(long num)
        {
            return String.Format("{0:D19} Nano Seconds", num);
        }

        public static string MinPad(long num)
        {
            TimeSpan t = TimeSpan.FromMinutes(num);
            return string.Format("{0:D2}h:{1:D2}m", t.Hours, t.Minutes);
        }

        /// <summary>
        /// Method to reconfigure Levels. Level is taken from static variable
        /// </summary>
        private static void ReConfigureLoggerLevel()
        {
            logger.Debug("Started.");

            try
            {
                // Max is always Fatal
                LogLevel max = LogLevel.FromOrdinal(CommonConstants.LogLevelMax);
                LogLevel min = loglevel;

                logger.Debug($"Setting LogLevel to min {min}");

                foreach (var rule in LogManager.Configuration.LoggingRules)
                {
                    logger.Debug($"Changing Rule LogLevel to  min {min}");

                    // First thing is to disable all Levels. Then we can enable ONLY the levels we want
                    // 0 = Trace, 1 = Debug .......... 5 = Fatal
                    for (int i = CommonConstants.LogLevelMin; i <= CommonConstants.LogLevelMax; i++)
                    {
                        rule.DisableLoggingForLevel(LogLevel.FromOrdinal(i));
                    }
                    rule.EnableLoggingForLevels(min, max);
                }

                //Call reconfigure to refresh the changes.
                LogManager.ReconfigExistingLoggers();
                logger.Debug("Completed.");
            }
            catch (Exception ex)
            {
                logger.Error("Exception occured while changing log file for NLog from code." + ex);
                throw;
            }
        }
        /// <summary>
        /// Method to reconvifure log level. 
        /// Expects the minium level. Max level is always Fatal
        /// </summary>
        /// <param name="level"></param>
        public static void ConfigureLoggerLevel(string level)
        {
            if (String.IsNullOrEmpty(level))
            {
                string msg = "Loglevel cannot be null or empty";
                logger.Error(msg);
                throw new Exception(msg);
            }
            else
            {
                loglevel = LogLevel.FromString(level);
            }
            ReConfigureLoggerLevel();
        }

        /// <summary>
        /// Method to configure log path.
        /// </summary>
        /// <param name="logfilepath"></param>
        public static void ConfigureLogPath(string logfilepath)
        {
            logger.Debug($"Started for path {logfilepath}.");
            LogManager.Configuration.Variables[FilePaths.NlogPathVarName] = logfilepath;
            logger.Debug("Completed.");
        }


        /// <summary>
        /// Method to change the name if the Target file at Runtime.
        /// This is originally used to have separate log file for Preview
        /// </summary>
        /// <param name="sourceName"></param>
        /// <param name="targetName"></param>
        /// <returns></returns>
        public static bool ConfigureLogger(string sourceName, string targetName)
        {
            logger.Debug("Started.");

            try
            {
                logger.Debug($"Setting log file path for Application: Souce : {sourceName}, Target : {targetName}.");

                var target = LogManager.Configuration.FindTargetByName(CommonConstants.DefaultLoggerTargetName);
                var asyncTarget = target as AsyncTargetWrapper;
                var fileTarget = asyncTarget.WrappedTarget as FileTarget;
                var file = fileTarget.FileName;
                var archiveFile = fileTarget.ArchiveFileName;

                logger.Debug($"Current log target is file: {file}, archive file: {archiveFile}");

                //Read the file name and replace with the arguments.
                //Trim('\'') is added to remove the extra single quotes added while conversion from Layout type to string.
                var fileName = file.ToString().Replace(sourceName, targetName).Trim('\'');
                var archiveFileName = archiveFile.ToString().Replace(sourceName, targetName).Trim('\'');

                fileTarget.FileName = fileName;
                fileTarget.ArchiveFileName = archiveFileName;

                //Flushing existing logs.
                LogManager.Flush();

                //Call reconfigure to refresh the changes.
                LogManager.ReconfigExistingLoggers();
                logger.Debug("Completed.");
            }
            catch (Exception ex)
            {
                logger.Error("Exception occured while changing log file for NLog from code." + ex);
                throw;
            }

            return true;
        }

        public static void GarbageCollector()
        {

            if (IsManualGarbageCollector)
            {
                logger.Info("Started");
                //(https://stackoverflow.com/a/478177)  For large forms Garbage collector can be called ex
#pragma warning disable S1215 // "GC.Collect" should not be called [Since previous method releases many resources]
                GC.Collect();
#pragma warning restore S1215 // "GC.Collect" should not be called
                GC.WaitForPendingFinalizers();
#pragma warning disable S1215 // "GC.Collect" should not be called [Since previous method releases many resources]
                GC.Collect();
#pragma warning restore S1215 // "GC.Collect" should not be called
                logger.Info("Completed");

            }
            else
            {
                logger.Info("Manual Garbage collection is disabled");
            }

        }

        /// <summary>
        /// Method creates a list of time stamps for monthly aggregation for the start and end timestamps given.
        /// </summary>
        /// <param name="startTimeStamp"></param>
        /// <param name="endTimeStamp"></param>
        /// <returns>timeIntervals - List of ValueTuple</returns>
        public static List<(long, long, long)> GetIntervalsForMonthlyAgg(long startTimeStamp, long endTimeStamp)
        {
            logger.Debug("Start");
            List<(long, long, long)> timeIntervals = new List<(long, long, long)>();
            //startTS - start timestamp for each sub time period. This is the start timestamp passed from the UI for the first iteration 
            //and the start of each month for the rest. tsStartOfMonth - this is the start timestamp of each month for showing in the UI. This is in 
            //compliance with the behavior of influx db. iteratorTS - gives the end timestamp of each month. For the last iteration, it is the endTimeStamp
            //received from the UI.
            long startTS = startTimeStamp;
            DateTime start = startTS.FromUnixToDateTime();
            long tsStartOfMonth = start.Date.AddDays(-start.Day + 1).DateTimeToUnixTime();
            long iteratorTS = tsStartOfMonth.FromUnixToDateTime().AddMonths(1).AddMilliseconds(-1).DateTimeToUnixTime();

            while (iteratorTS < endTimeStamp)
            {
                timeIntervals.Add(new ValueTuple<long, long, long>(startTS, iteratorTS, tsStartOfMonth));
                tsStartOfMonth = startTS = iteratorTS.FromUnixToDateTime().AddMilliseconds(1).DateTimeToUnixTime();
                iteratorTS = tsStartOfMonth.FromUnixToDateTime().AddMonths(1).AddMilliseconds(-1).DateTimeToUnixTime();
            }

            if (startTS != startTimeStamp)
            {
                timeIntervals.Add(new ValueTuple<long, long, long>(startTS, endTimeStamp, tsStartOfMonth));
            }
            logger.Info($"Intervals count for Monthly aggregation: {timeIntervals.Count}");
            string timeintervalsForLog = string.Join(Environment.NewLine, timeIntervals);
            logger.Debug($"timeIntervals: {Environment.NewLine}{timeintervalsForLog}");
            logger.Debug("End");

            return timeIntervals;
        }

        /// <summary>
        /// This method checks the size of the message and logs it appropriately. When the message size is large, the application hangs
        /// and results in misbehavior.
        /// Changes done as part of bug 1189(data logs in Trace mode).
        /// Changes for story 11274 - size based logging.
        /// </summary>
        /// <param name="message">The message to be logged.</param>
        public static void LogBasedonSize(string message)
        {
            try
            {
                //Get size of the string message to be logged. Gives the value in bytes.
                var messageSize = System.Text.ASCIIEncoding.Default.GetByteCount(message);

                if (messageSize > ActiveServiceHostConstants.LogMessageCharSizeMaxLimit)
                {
                    logger.Error($"Message size is larger than max limit for logging: {messageSize}. Log file will not be updated.");
                }
                else if (messageSize > ActiveServiceHostConstants.LogMessageCharSizeLimit)
                {
                    var messageLimit = ActiveServiceHostConstants.LogMessageCharSizeLimit / 2;
                    logger.Trace($"Message is higher than first limit {messageSize}. Printing first and last n characters");
                    logger.Trace($"Logging first part: {Environment.NewLine} {message.Substring(0, messageLimit)}");
                    logger.Trace($"Logging last part: {Environment.NewLine} {message.Substring(message.Length - messageLimit, messageLimit)}");
                }
                else
                {
                    logger.Debug($"Message content is: {Environment.NewLine} {message}");
                }
            }
            catch (Exception ex)
            {
                logger.Error("Exception occured while calculating size of the message to be logged." + ex);
            }
        }

        /// <summary>
        /// Function to start an application process.
        /// </summary>
        /// <param name="filePath"></param>
        public static int StartApp(string filePath, string args = null, string waitString = null)
        {
            try
            {
                var process = new Process();
                int processid;
                process.StartInfo.FileName = filePath;
                process.StartInfo.Arguments = args;

                logger.Info($"File: {process.StartInfo.FileName}");
                logger.Info($"Arguments: {process.StartInfo.Arguments}");
                process.StartInfo.CreateNoWindow = true;
                process.StartInfo.ErrorDialog = false;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.RedirectStandardInput = true;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                logger.Info($"Application processes Starting.");
                bool res = process.Start();

                //Adding delay to avoid issues while back to back calls.
                Thread.Sleep(CollectCommonConstants.DelaybtwProcessStarts);

                if (res && !process.HasExited)
                {
                    logger.Info($"Started process {process.ProcessName} with id: {process.Id}");
                    processid = process.Id;
                }
                else
                {
                    throw new Exception($"Could not start the process. Exitcode: {process.ExitCode}");
                }

                //Wait logic for checking completion of script using the prints in StandardOutput.
                if (!string.IsNullOrEmpty(waitString))
                {
                    logger.Debug($"WaitString is {waitString}.");

                    if (waitString.Equals(CommonConstants.EndOfFile))
                    {
                        while (!process.StandardOutput.EndOfStream)
                        {
                            logger.Debug(process.StandardOutput.ReadLine());
                        }
                    }
                    else
                    {
                        string line = string.Empty;
                        logger.Debug("Checking for waitString.");
                        while (!line.Contains(waitString))
                        {
                            line = process.StandardOutput.ReadLine();
                            logger.Debug(line);
                        }
                        logger.Debug($"Application start script completed successfully.");
                    }
                }
                else
                {
                    logger.Debug("Wait string is null.");
                }

                return processid;
            }
            catch (Exception ex)
            {
                logger.Error($"Exception occured while starting application.{Environment.NewLine}File: {filePath}.{Environment.NewLine}{ex}");
                return 0;
            }
        }


        /// <summary>
        /// Kill a process, and all the child process tree recursively.
        /// </summary>
        /// <param name="pid">Process ID.</param>
        private static void KillProcessAndChildren(int pid)
        {
            logger.Debug("Start.");
            // Cannot close 'system idle process'.
            if (pid == 0)
            {
                logger.Warn("Cannot close an idle process.");
                return;
            }

            Process proc = Process.GetProcessById(pid);
            string procdetails = $"Name: {proc.ProcessName}, ID: {proc.Id}";
            logger.Debug($"Kill child processes of - {procdetails}");

            ManagementObjectSearcher searcher = new ManagementObjectSearcher
                    (CommonConstants.GetChildProcessQuery + pid);
            ManagementObjectCollection moc = searcher.Get();
            logger.Debug($"Number of child processes is {moc.Count}");

            foreach (ManagementObject mo in moc)
            {
                logger.Debug($"Current process ID: {mo["ProcessID"]}, Name: {mo["Name"]}");
                KillProcessAndChildren(Convert.ToInt32(mo["ProcessID"]));
            }
            try
            {
                logger.Debug($"About to kill process - {procdetails}");
                proc.Kill();
                ProcessWaitForExit(proc);
            }
            catch (Exception ex)
            {
                logger.Error($"Exception occurred while killing process: {procdetails}. Exception :  {ex}");
                ProcessWaitForExit(proc);
            }
            logger.Debug("Completed.");
        }

        /// <summary>
        /// Wait for exit in a common place.
        /// </summary>
        /// <param name="proc"></param>
        private static void ProcessWaitForExit(Process proc)
        {
            string procdetails = $"Name: {proc.ProcessName}, ID: {proc.Id}"; ;
            logger.Debug(procdetails);
            // Wait for a timeout.
            bool exited = proc.WaitForExit(CommonConstants.ProcessWaitForExitTimeout);
            if (exited)
            {
                logger.Info($"Kill Completed: {procdetails}");
            }
            else
            {
                logger.Error($"Kill Failed. {procdetails} process could be still running");
            }
        }

        public static bool StopApplications(List<int> processids)
        {
            bool result = false;
            Process proc = null;
            try
            {
                foreach (int processid in processids)
                {
                    proc = Process.GetProcessById(processid);
                    if (!proc.HasExited)
                    {
                        logger.Info($"About to Kill the PROCESS TREE of {proc.ProcessName}");
                        KillProcessAndChildren(proc.Id);
                        result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Info($"Failed to Kill process. {ex}");
                result = false;
            }
            finally
            {
                if (proc != null)
                {
                    proc.Dispose();
                }
            }
            return result;
        }

        public static bool StopApplications(List<string> applicationNames)
        {
            bool result = false;
            System.Diagnostics.Process[] processArray = null;
            try
            {
                foreach (var appname in applicationNames)
                {

                    processArray = Process.GetProcessesByName(appname);
                    logger.Debug($"processArray Length = {processArray.Length}");
                    if (processArray.Length > 0)
                    {
                        Process proc = processArray[0];
                        if (!proc.HasExited)
                        {
                            logger.Info($"About to Kill the PROCESS TREE of {appname}");
                            KillProcessAndChildren(proc.Id);
                            result = true;
                        }
                    }
                    else
                    {
                        logger.Warn($"{appname} Process Not running");
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Info($"Failed to Kill {ex}");
                result = false;
            }
            finally
            {
                if (processArray != null)
                {
                    foreach (Process p in processArray)
                    {
                        p.Dispose();
                    }
                }
            }
            return result;
        }
    }




    /// <summary>
    /// This method reads the configuration for the corsponding key
    /// </summary>
    /// <param name="configkey"></param>
    /// <returns></returns>
    /// 
    public class ConfigReader
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public virtual String ConfigPath
        {
            get
            {
                // Given the side, return the area of a square:
                return CommonConstants.ConfigPathNotConfigured;
            }
        }

        public ConfigReader()
        {
            ReadAllConfiguration(this.GetType());
        }

        public void ReadAllConfiguration(Type ConfigType)
        {
            logger.Info("Started.");
            try
            {
                logger.Info($"Config Path = {ConfigPath}");
                if (ConfigPath == CommonConstants.ConfigPathNotConfigured)
                {
                    throw new Exception("Config Path Not configured by derived class");
                }

                using (AppConfig.Change(ConfigPath))
                {
                    foreach (System.Reflection.FieldInfo Field in ConfigType.GetFields())
                    {
                        string ConfigValue = String.Empty;
                        string ConfigKey = Field.Name;
                        ConfigValue = ConfigurationManager.AppSettings[ConfigKey];
                        logger.Info($"collectUiconfiguration for the key:{ConfigKey} is:{ConfigValue} loaded.");
                        logger.Info($"Type = {Field.FieldType}");
                        ShowError(ConfigValue != null, $"{ConfigKey} is missing in Config file", false);
                        ShowError(ConfigValue != string.Empty, $"{ConfigKey} has NO value in Config file" + ConfigKey, false);

                        if (Field.FieldType == typeof(String))
                        {
                            Field.SetValue(Field, ConfigValue);
                        }
                        else if (Field.FieldType == typeof(Boolean))
                        {
                            if (!Boolean.TryParse(ConfigValue, out Boolean v))
                            {
                                throw new Exception("Not a Boolean");
                            }
                            Field.SetValue(Field, v);
                        }
                        else if (Field.FieldType == typeof(UInt32))
                        {
                            if (!UInt32.TryParse(ConfigValue, out UInt32 v))
                            {
                                throw new Exception("Not a UInt32");
                            }
                            Field.SetValue(Field, v);
                        }
                        else if (Field.FieldType == typeof(int))
                        {
                            if (!int.TryParse(ConfigValue, out int v))
                            {
                                throw new Exception("Not an int");
                            }
                            Field.SetValue(Field, v);
                        }
                        else if (Field.FieldType == typeof(ushort))
                        {
                            if (!ushort.TryParse(ConfigValue, out ushort v))
                            {
                                throw new Exception("Not a ushort");
                            }
                            Field.SetValue(Field, v);
                        }
                        else if (Field.FieldType == typeof(System.Globalization.CultureInfo))
                        {
                            Field.SetValue(Field, new System.Globalization.CultureInfo(ConfigValue));
                        }
                        else
                        {
                            String msg = $"Unhandled Type {Field.FieldType}";
                            logger.Fatal(msg);
                            throw new Exception("msg");
                        }

                        logger.Info($"{Field.Name} = {Field.GetValue(Field)}");
                        logger.Info($"{ConfigKey} = {ConfigValue}");

                    }


                }
                logger.Info("Completed");
            }
            catch (Exception exception)
            {
                logger.Error(exception, "Exception occured while Reading cofiguration");
                throw;
            }
        }

        /// <summary>
        /// this metod gives an error pop up
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="Message"></param>
        public static void ShowError(bool condition, string Message, bool isPopup)
        {
            if (!condition)
            {
                logger.Error(Message);
                if (isPopup)
                {
                    //MessageBox.Show(Message);
                }
                else
                {
                    throw new Exception(Message);
                }
            }
        }

    }



}
