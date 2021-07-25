//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using Common.Models;
using Common.Utils.Models;
using NLog;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Collect.Master.Service
{
    public class InfluxHelper
    {
        private static Task logTask;
        private static Task logErrTask;
        private static CancellationTokenSource tokenSource;
        private static Logger logger = LogManager.GetLogger(CollectCommonConstants.InfluxLoggerName);
        private static Process process;

        public InfluxHelper()
        {

        }

        public static void StartInfluxdb()
        {
            //Start Influx db (influxd.exe)
            logger.Info("Starting influxd.exe");
            //influxlogger.Info("Started configuring influx db.");

            try
            {

                //InfluxServiceConfiguration cnf = new InfluxServiceConfiguration();
                string influxversion = CollectMasterServiceConfiguration.InfluxVersion;
                string influxFolder = FilePaths.InfluxServerFolder + "-" + influxversion;

                bool IsInfluxDBLogEnabled = CollectMasterServiceConfiguration.IsInfluxDBLogEnabled;
                process = new Process();

                // Get Influx Data Directory 
                string dataDir = Utils.GetInfluxDataFolder();
                logger.Info($"Influx Data Dir = {dataDir}");
                if (!string.IsNullOrEmpty(dataDir))
                {
                    // Form the path of the config file
                    string conf = Path.Combine(Utils.GetInstallFolder(), FilePaths.InfluxPath, influxFolder, FilePaths.InfluxConfigFileName);
                    logger.Info($"Conf file Path = {conf}");
                    // Search and replace the path in the configuration file
                    // In Influx conf file paths should be given in linux style (with forward slash)
                    dataDir = dataDir.Replace(@"\", "/");
                    replacer(InfluxConstants.defaultDataDir, dataDir, conf);
                }
                else
                {
                    logger.Info("Influx Data Dir is NOT set in Environment");
                    logger.Info($"Retaining the default path in conf file = {InfluxConstants.defaultDataDir}");
                }

                process.StartInfo.FileName = Path.Combine(Utils.GetInstallFolder(), FilePaths.InfluxStartupScript);
                process.StartInfo.Arguments = influxFolder;

                logger.Info($"File: {process.StartInfo.FileName}");
                logger.Info($"Arg : {process.StartInfo.Arguments}");

                process.StartInfo.CreateNoWindow = true;
                process.StartInfo.ErrorDialog = false;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.RedirectStandardInput = true;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
                logger.Info("Starting");
                process.Start();
                logger.Info("Started");

                logger.Info("Starting the logTask");
                tokenSource = new CancellationTokenSource();
                CancellationToken ct = tokenSource.Token;
                logger.Info("Starting Task for Standard Output");
                logTask = Task.Run(() => InfluxLog(process.StandardOutput), ct);

                // Influx DB Logging is in Standard Error. Read it only if enabled.
                if (IsInfluxDBLogEnabled)
                {
                    logger.Info("Starting Task for Standard Error (for InfluxDB)");
                    logErrTask = Task.Run(() => InfluxLog(process.StandardError), ct);
                }
                //influxlogger.Info("Completed");
                logger.Info("Completed");
            }
            catch (Exception ex)
            {
                logger.Error($"Exception occured Starting Influx DB Server :  {ex.Message}");
            }
        }

        private static void replacer(string searchstr, string replacestr, string file)
        {
            try
            {
                logger.Info("Started");
                logger.Info($"search for '{searchstr}' and replace with '{replacestr}' in file '{file}' ");
                string str = File.ReadAllText(file);
                str = str.Replace(searchstr, replacestr);
                File.WriteAllText(file, str);
                logger.Info("Completed");
            }
            catch (Exception ex)
            {
                logger.Error($"Replacing Path in config file failed {ex}");
                throw;
            }
        }

        private static void InfluxLog(StreamReader stream)
        {
            logger.Info("InfluxLog : Started");
            // Read from standard input and write to Logger
            while (!stream.EndOfStream)
            {
                string output = stream.ReadLine();
                logger.Info(output);
            }
            logger.Info("InfluxLog : Completed");
        }
    }

}

