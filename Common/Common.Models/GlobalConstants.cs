//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models
{

    public static class AppNameConstants
    {
        /// <summary>
        /// Active Applications Names
        /// </summary>
        public const string ActiveName = "Active-t";
        public const string ActiveClientApplicationName = "Active-t RT Client";
        public const string ActiveServerApplicationName = "Active-t RT Server";
        public const string ActiveWorkbenchApplicationName = "Active-t Workbench";
        public static string ActivClientSettingsWindowName = Properties.Resources.RTClientSettingWindowTitle;

        public const string AlertsName = "Alerts";
        public const string AlertManagerName = "AlertManager";
        public const string AlertWebServerName = "AlertWebServer";
        public const string AlertServerName = "AlertServer";

        /// <summary>
        /// Collect Applications Names
        /// </summary>
        public const string CollectName = "Collect-x";
        public const string CollectConfiguratorName = "Collect-x Configurator";
        public const string CollectWebServerName = "CollectWebServer";
        public const string CollectModTCPServerName = "Collect-x ModbusTCP Server";
        public const string InfluxdbExeName = "influxd";

        /// <summary>
        /// Key Applications Names
        /// </summary>
        public const string KeyName = "Key";
        public const string KeyManagerName = "Key Manager";

        public const string ProdReleaseYear = "2020";
        public static readonly string ReleaseYear = $"{ProdReleaseYear} Release";
        public static readonly string CopyRight = Convert.ToChar(169).ToString() + $"SPIA {ProdReleaseYear}, All rights reserved";
    }

    /// <summary>
    /// All Tooltips for Active Workbench
    /// </summary>
    public static class WorkbenchToolTipConstants
    {
        public const string DashboardBuilderSwitcherTT = "Dashboard Builder";
        public const string ReportDesignerSwitcherTT = "Report Designer";
        public const string AddNewTT = "Add New";
        public const string ExpandListTT = "Expand List";
        public const string CloneTT = "Clone";
        public const string DeleteTT = "Delete";
        public static string ShowHideRibbonTT = "Show/Hide Ribbon";
    }
    /// <summary>
    /// Constants for Preview Windows
    /// </summary>
    public static class PreviewWindowConstants
    {
        //Preview Window Width or Height Multiplier 
        public static double PreviewWindowSizeMultiplier = 0.9;
        public static string DashboardPreviewTitle = "Dashboard Preview";
        public static string ReportPreviewTitle = "Report Preview";
    }

    /// <summary>
    /// Constants for Active Workbench
    /// </summary>
    public static class WorkbenchCommonConstants
    {
        //constants to replace the assembly names inside Dashboard(screen) and Report(page) Xaml Files
        public const string oldWorkbenchAssemblyName = "assembly=Active Workbench";
        public const string newWorkbenchAssemblyName = "assembly=Active-t Workbench";

        public const double LeftExpanderWidth = 220;
        public const double arrowKeyOnlyMovement = 1;
        public const double arrowKeyStepMovement = 10;
        public const double arrowKeyStepRotation = 15;
        public const int TileHeaderLength = 32;
        public const int TileDescriptionLength = 100;
        public const int FitCanvasToWorkAreaThreshold = 10;
        public const string PinningButton = "PinningButton";
        public const string RightPanelCollapse = "RightPanelCollapse";
        public const string MainContentContainerName = "WindowMainContent";

        public const string workbenchControlParentType = "DesignerItem";
        public const string runtimeControlParentType = "ActiveCommonCanvas";

        public const string DataNoLimitString = "NoLimit";

        public static string defaultScriptContent = @"

# WRITE YOUR SCRIPT HERE

if PreBind:
    ThisControl.Show()



# END OF YOUR SCRIPT


################################################################
########################### EXAMPLES ###########################
################################################################

#===================================#
#========== Example 1 ==============#
#===================================#

## Set Background Color based on Tag Value
''''

if PreBind:
    val1 = GetValue()
    if val1 > 10 and val1 < 20:
        ThisControl.SetColor('yellow')
    elif val1 > 100:
        ThisControl.SetColor('red')
    else:
        ## Set Green using hex code
        ThisControl.SetColor('#FF00FF00')

'''
# Full List of supported Colours & Colour codes
#  https://docs.microsoft.com/en-us/dotnet/api/system.windows.media.brushes?view=netframework-4.6.2

#===================================#
#========== Example 2 ==============#
#===================================#

## Set Visibility of the Controls based on Tag Value
'''

if PreBind:
    val1 = GetValue()
    if val1 % 2 == 0:
        ThisControl.Show()
    else:
        ThisControl.Hide()

'''
#===================================#
#========== Example 3 ==============#
#===================================#

## Change Text based on another control's value
'''

if PreBind:
    val1 = Numeric_1.GetValue()
    if val1 == 0:
       Label_1.SetText('OFF')
    elif val1 == 1:
       Label_1.SetText('ON')
    else:
        Label_1.SetText('ERROR') 

'''
#===================================#
#========== Example 4 ==============#
#===================================#

## Show a Gauge's reading in Numeric
'''

if PreBind:
    TemperatureVal = Gauge_1.GetValue()
    Numeric_2.SetValue(TemperatureVal)

'''
#===================================#
#========== Example 5 ==============#
#===================================#

## Show a blinking ALERT message when the values is greater than a threshold value
## Hide the message in all other cases
'''

if PreBind:
    InputVoltage = Numeric_1.GetValue()
    if InputVoltage > 240:
        Label_2.SetText('HIGH VOLTAGE') 
        Label_2.Blink()
    else:
        Label_2.Hide()

'''

#===================================#
#========== Example 6 ==============#
#===================================#

## If the change in value is too high - alert the user
## Compare the current value in a control and the arrived value (which is about to be set to control)
'''
if PreBind:
    CurrentVal = ThisControl.GetValue()
    NewVal = GetValue()
    Diff = abs(NewVal - CurrentVal)
    if Diff > 10:
        ThisControl.SetColor('red')
    else:
       ThisControl.SetColor('green')
'''
";

        public static string syntaxHighlightingFile = "ICSharpCode.PythonBinding.Resources.Python.xshd";

        public static string dashboardScreenType = "Screen";

        public static string scriptEditorWindowName = "ScriptEditor - ";

        public const char DashboardScreenSizeSeparator = 'x';
        //Screen Sizes for Dashoards
        public static readonly List<string> DashboardScreenSizes = new List<string>()
        {
            $"1920{DashboardScreenSizeSeparator}1080",
            $"1366{DashboardScreenSizeSeparator}768",
            $"1280{DashboardScreenSizeSeparator}720",
            $"1024{DashboardScreenSizeSeparator}768",
            $"800{DashboardScreenSizeSeparator}600"
        };

        public static readonly string SavingStatus = " - Saving...";

        public static readonly List<Tuple<string, string>> TuplesforCompatibility = new List<Tuple<string, string>>
            {
                Tuple.Create(WorkbenchCommonConstants.oldWorkbenchAssemblyName, WorkbenchCommonConstants.newWorkbenchAssemblyName),
                Tuple.Create("Active.Workbench.UI_Class.ControlGrouping", "Active.Workbench.DesignerItemComponents"),
                //The below two entries are specifically needed for handling ENTAWAK Build 054 projects.
                //This may be removed in later builds.
                Tuple.Create(@"xmlns:awdic=""clr -namespace:Active.Workbench.DesignerItemComponents;assembly=Active-t Workbench""", string.Empty),
                Tuple.Create("awdic:", string.Empty)
            };
    }

    /// <summary>
    /// Constants for Runtime Client
    /// </summary>
    public static class RuntimeClientCommonConstants
    {
        public const string DashboardsTabSelector = "Dashboards";
        public const string ReportsTabSelector = "Reports";
        public const string ExplorerApplication = "explorer.exe";

    }


    /// <summary>
    /// Collect StatusBar Constants
    /// </summary>
    public static class CollectConfiguratorStatusBarConstants
    {
        public const string TagsCountToolTip = "Number of Tags";
        public const string ServerConnectedStatusToolTip = "Server Connected";
        public const string ServerDisConnectedStatusToolTip = "Server Disconnected";
        public const string DatabaseConnectedToolTip = "Database Connected";
        public const string DatabaseServerUnavailableToolTip = "Database Server Unavailable";
        public const string DatabaseSchemaErrorToolTip = "Database Schema Error";
        public const string SoftwareVersionToolTip = "Software Version";
    }

    /// <summary>
    /// RunTime Client Statusbar Constants
    /// </summary>
    public static class RTClientStatusBarConstants
    {
        public const string ProjectNameToolTip = "Project Version: ";
        public const string TagsCountToolTip = "Number of Tags Used";
        public const string ServerConnectedStatusToolTip = "Server Connected";
        public const string ServerDisConnectedStatusToolTip = "Server Disconnected";
        public const string SoftwareVersionToolTip = "Software Version";
        public const string LicenceStatusGracePeriodToolTip = "Licence Status : Grace Period";
        public const string LicenceStatusBlockedToolTip = "Licence Status : Blocked";
        public const string LicenceStatusNormalToolTip = "Licence Status : Normal";
        public const string LicenceStatusDemoToolTip = "Licence Status : Demo";
        public const string TagCountSeperator = "/";
    }

    /// <summary>
    /// It is used to determine, whether UI Conrol is in Dashboard or Report.
    /// </summary>
    public static class CanvasParentType
    {
        public const string DashboardParentType = "Dashboard";
        public const string ReportParentType = "Report";
    }

    public static class SelectedAggregationConstants
    {
        /// <summary>
        /// This Class is Common to  all Controls
        /// </summary>
        /// 
        public const string All = "All";
        public const string PerMinute = "Per Minute";
        public const string Hourly = "Hourly";

        public const string Daily = "Daily";
        public const string Weekly = "Weekly";
        public const string Monthly = "Monthly";
        public const string Quarterly = "Quarterly";

        public const string Second = "Second";
        public const string Minute = "Minute";
        public const string Hour = "Hour";
        public const string Day = "Day";

        //Aggregation constants for validating LineChart.
        public const string OneMinute = "1m";
        public const string OneHour = "1h";
        public const string OneDay = "1d";

        public static readonly List<string> AggregationList = new List<string> { All, PerMinute, Hourly, Daily, Weekly, Monthly };

        public static readonly List<string> AggregationUnitList = new List<string> { Second, Minute, Hour, Day };

        public static readonly Dictionary<double, List<string>> MaxAllowedAggForReportLookup = new Dictionary<double, List<string>>()
        {
            //1/24 is for an hour. We get TimeSpan.TotalDays which gives fractions for less than 1 day values.
            { (double)1/24, new List<string>{ OneMinute, PerMinute } },
            { 1, new List<string>{ OneMinute, OneHour, PerMinute, Hourly } },
            { 7, new List<string>{ OneHour, OneDay, Hourly, Daily } },
            { 30, new List<string>{ OneDay, OneHour, Daily, Weekly } },
            { CommonConstants.MaxNumberofDaysForReport, new List<string>{ OneDay, Weekly, Monthly } }
        };
        public const string EmptyValue = "";
    }


    /// <summary>
    /// This is common to all controls.
    /// </summary>

    public enum SelectedAggregationUnitConstants
    {
        Second, Minute, Hour, Day
    };

    public static class SelectedControlPeriodConstants
    {
        /// <summary>
        /// This is Common to all controls
        /// </summary>
        public const string None = "None";
        public const string Today = "Today";
        public const string ThisWeek = "This Week";
        public const string ThisMonth = "This Month";
        public const string ThisYear = "This Year";
        public const string LastHour = "Last Hour";
        public const string LastDay = "Last Day";
        public const string LastWeek = "Last Week";
        public const string LastMonth = "Last Month";
        public const string Last6Months = "Last 6 Months";
        public const string Last3Months = "Last 3 Months";
        public const string LastYear = "Last Year";
    }

    public static class SelectedFunctionConstants
    {
        /// <summary>
        /// This is common to All controls.
        /// </summary>
        public const string None = "None";
        public const string Last = "Last";
        public const string RealTime = "Real Time";

        public const string Average = "Average";
        public const string Sampling = "Sampling";
        public const string All = "All";
        public const string Downsampling = "Downsampling";
        public const string Delta = "Delta";
        public const string Difference = "Difference";
        public const string Max = "Max";
        public const string Min = "Min";
        public const string Sum = "Sum";
        public const string Custom = "Custom";
        public const string Uptime = "Uptime";
        public const string UpDownTime = "UpDownTime";
        public const string DownTime = "DownTime";

        public const string Toggle = "Toggle";
    }

    public static class FilePaths
    {
        public const string Drive = "C:";
        public const string Sep = @"\";
        public const string BaseFolderName = CommonConstants.OrgName;
        public const string ProductPackageName = "i4 Suite";
        public const string AppRootPath = Drive + Sep + BaseFolderName;
        public const string ConfigPath = AppRootPath + Sep + "Config";
        public const string AppDataPath = AppRootPath + Sep + "AppData";
        public const string ProgramFilesFolder = Drive + Sep + "Program Files";
        public const string ProgramFilesFolderx86 = ProgramFilesFolder + " (x86)";
        public const string NlogPathVarName = "logpath";

        public static readonly string CollectPath = "Collect-x";
        public static readonly string CollectServersPath = CollectPath + Sep + "Collect-x Servers";
        public static readonly string CollectWebServerPath = CollectServersPath + Sep + "CollectWebServer";
        public static readonly string CollectModbusTCPServerPath = CollectServersPath + Sep + "Collect-x ModbusTCP Server";
        public static readonly string CollectWebServerStartupScript = "appsStartup.bat";
        public static readonly string InfluxPath = CollectPath + Sep + "Influx";
        public static readonly string CollectAppsPath = CollectPath + Sep + "Collect-x-Apps" + Sep + "Collect.Apps";
        public static readonly string AppsStartupScriptName = "appsStartup.bat";
        public static readonly string MQTTBrokerSTARTUPScriptName = "START.bat";
        public static readonly string MQTTBrokerSETUPScriptName = "SETUP.bat";

        public static readonly string AlertsPath = "Alerts";
        public static readonly string AlertServerPath = AlertsPath + Sep + "AlertServer";
        public static readonly string AlertWebServerPath = AlertsPath + Sep + "AlertWebServer";
        public static readonly string AlertManagerPath = AlertsPath + Sep + "AlertManager";
        public static readonly string AlertWebServerStartupScript = "appsStartup.bat";
        public static readonly string AlertManagerStartupScript = "appsStartup.bat";

        public static readonly string InfluxStartupScript = InfluxPath + Sep + "influxStartup.bat";
        public static readonly string InfluxConfigFileName = "influxdb.conf";
        public static readonly string InfluxServerFolder = "influxdb";

        public static readonly string ActiveWebServerPath = BaseFolderName + Sep + @"Active\Active Web Server";
        public static readonly string CollectStopScript = CollectPath + Sep + @"CollectService\StopCollectService.bat";
        public static readonly string CollectStartScript = CollectPath + Sep + @"CollectService\StartCollectService.bat";
    }

    public static class LogFilePaths
    {
        public const string CollectModbusTCPServerLogPath = @"C:/SPIA/Logs/Collect-x-Server/Collect-x-ModbusTCPServer/Collect-x-ModbusTCPServerLog";
    }

    public static class InfluxConstants
    {
        public const string InfluxDBProcessName = "influxd";
        public static readonly string ConfigPath = Path.Combine(FilePaths.ConfigPath, "InfluxDBServerConfig.xml");
        public static readonly string defaultDataDir = @"C:/SPIA/Data";
    }

    public static class DateTimeFormatConstants
    {
        public const string DefaultDateTimeStringFormat = "yyyy-MM-dd HH:mm:ss";
    }

    public static class ActivenotificationtrayConstants
    {

        public const string BalloonTipTitle = ActiveServerName;
        public static readonly string BalloonTipText = $"View {ActiveServerName} status here";
        public const string ServiceStatus = "Server Running";
        public const string IconToolTipText = ActiveServerName + " Manager";
        public static readonly string ServiceRunning = $"{AppNameConstants.ActiveServerApplicationName} Running";
        public static readonly string ServiceStopped = $"{AppNameConstants.ActiveServerApplicationName} Stopped";
        public const int TimePeriod = 3000;
        public const string ActiveServer = "Active-t-RTServer";
        public const string ActiveServerName = "Active-t RT Server";
        public const string Running = "RUNNING";
        public const string Stoped = "STOPPED";
        public const string ProcessName = "Active.UI";
        public const string ProcessFilePath = @"ActiveUI\Active.UI.exe";
        public const string TruncationIndicator = "...";

        // Constants related to select project from notification tray
        public const string SelectProject = "Load New Project";

        public const string InitialDirectory = @"C:\";
        public static readonly string ProjectFilter = $"Active-t Project| *.{CommonConstants.ProjectExtension}*";
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "Active-t-NotificationTrayConfig.xml";
        public const string ProjectRefreshRequestMessage = "Refresh Request";
        public const string ProjectCopyStart = "Copying Project to root folder, will be notified on completing";
        public const string ProjectCopyComplete = "Copying Project to root folder completed";
        public const string NoProjectLoadedMessage = "No Project Loaded";
        public const string ReadyFileName = @"\Ready.txt";

        public const int LabelWidth = 160;
        public const int LabelHeight = 75;
        public const int MenuItemWidth = 190;
        public const int MenuItemHeight = 85;
        public const int ProjectNameLength = 18;

        public const string ActiveNotificationTrayAppName = "Active-t Notification Tray"; //Active Notification Tray Application Name
    }

    public static class CollectnotificationtrayConstants
    {
        public const string IconToolTipText = CollectServerName + " Manager";
        public const string BalloonTipTitle = CollectServerName;
        public const string CollectServerName = "Collect-x Server";
        public static readonly string BalloonTipText = $"View {CollectServerName} status here";
        public const string Running = "RUNNING";
        public const string Stopped = "STOPPED";
        public const int TimePeriod = 3000;
        public static readonly string ServiceRunning = $"{AppNameConstants.CollectName} Server Running";
        public static readonly string ServiceStopped = $"{AppNameConstants.CollectName} Server Stopped";
        public const string ServerToShowStatus = CollectMasterServiceConstants.ServiceName;
        public const string CollectNotificationTrayAppName = "Collect-x Notification Tray"; //Collect Application Name
        public const string NTrayOpenCollectUILabel = "Configure";

        //LogPackage related constants.
        public const string NTrayCreateLogPackageLabel = "Create Log Package";
        public const string LogPackageFolderName = "LogPackage"; //LogPackage folder in install location
        public const string LogPackageScriptName = "lpgen.bat"; //LogPackage script file name.
        public const string LogPackageBalloonTipTitle = "Log Package";
        public const string LogPackageBalloonTipText_Successful = "Log package created successfully. Click to open.";
        public const string LogPackageBalloonTipText_Failure = "Log package creation failed. Please check logs for details.";
        public const string LogPackageBalloonTipText_Started = "Started creating log package.";
        public const string LogPackageLevel1Name = "FULL";
        public const string LogPackageLevel2Name = "MINI";
        public const string LogPackageOptionMINI = "mini";
        public const string LogPackageOptionALL = "all";
        public const string LogFileNameDateTimeFormat = "yyyyMMdd-HHmmss";
        public const string defaultExtension = "zip";
        public static readonly string exportImportFilter = $"Log package Files (*.{defaultExtension})|*.{defaultExtension}";
        public const string Status_ok = "OK";
        public const string LogPackageFileNamePrefix = "SPIA-i4Suite-LogPackage";

    }

    /// <summary>
    /// This class is used to store Constants used in <see cref="XPSGenerator"/>
    /// </summary>
    public static class ActivePdfConstants
    {
        public const string DefaultConfigurationPdf = "PdfPath";
        public const string DefaultConfigurationXps = "ReportTemp";

        public const string YearFormat = "yyyy";
        public const string PathLiteral = "\\";
        public const string MonthFormat = "MMMM";
        public const string XpsExtention = ".xps";
        public const string DateTimeFormat = "yyyyMMdd'_'HHmmss";
        public const string PdfFileExtention = ".pdf";
        public const string PathSeparator = "_";
        public const int StartingIndex = 0;

        public const string ExportSuccessCaption = "Success";
        public const string FailCaption = "Error !";
        public const string ExportSuccessMessage = "Export To PDF Completed";
        public const string ExportFailMessage = "Export To PDF failed";
    }

    /// <summary>
    /// Constants class for Common.7zip project.
    /// </summary>
    public static class Common7zipConstants
    {
        public const string ZipFileExtention = ".7z";
        public const string ZipEXEFilename = "7za.exe";
    }

    /// <summary>
    /// Collection(Table) names in LiteDB
    /// </summary>
    public static class CollectionLiteDBConstants
    {
        public const string DBFileExtension = ".db";
        public const string Authentications = "Authentications";
        public const string SettingsTableName = "Settings_";
        public const string Password = "All your settings is mine";
    }

    /// <summary>
    /// This class is used to generate topics for Data binding for controls
    /// Also it store Common constants for Mqtt Communication
    /// </summary>
    public static class MqttCommonConstants
    {
        public const int DefaultPortAddress = 3883;
        public const string DefaultIPAddressWithoutPort = "127.0.0.1";
        public const string Username = "spiai4user";
        public const string Password = "All your sensors are mine";
        public const bool CleanSession = true;
        public const ushort KeepAlivePeriod = 60;

        // Total connect retry period will be 12 minutes
        public const int ConnectRetryCount = 12 * 6;
        public const int ConnectRetryWaitPeriod = 10 * 1000;
        public const int ReconnectWaitPeriod = 10 * 1000;

        // Moved from MQTTTopics.cs
        public const bool PrependRootTopic = true;
        public const string TopicRoot = "spiai4suite";

        public const string clearAllTagValuesMessage = "clearAllTagValues";

        public const string CollectIsServiceUpdateNeeded = "collect/IsServiceRefreshNeeded";
        public const string CollectServiceUpdatedAcknowledgment = "collect/ServiceUpdatedAcknowledgment";
        public const string CollectServiceDeviceRegistration = "DEVICE-TYPE/CREATE";
        public const string CollectServiceTagRegistration = "TAG-TYPE/CREATE";

        public const string CollectAllGroups = "collect/retain/allgroups";
        public const string CollectClearAllTag = "collect/settings/tags/clearall";
        public const string CollectPauseWriteToDB = "collect/request/PauseWriteToDB";
        public const string CollectResumeWriteToDB = "collect/request/ResumeWriteToDB";
        public const string CollectAllTagData = "DEVICES-TYPES/ALL";
        public const string CollectClearAllTagAcknowledgment = "collect/ClearAllTagAcknowledgment";
        public const string ActiveDataRequest = "active/data/request";
        public const string ActiveDataResponse = "active/data/response";
        public const string KeyDataRequest = "active/authentication/credentials";
        public const string KeyDataResponse = "active/authentication/response";
        public const string LicenseRequest = "active/license/get";
        public const string LicenseResponse = "active/license/status";
        public const string ProjectRefreshRequest = "active/project/current/request";
        public const string ProjectRefreshResponse = "active/project/current/response";
        public const string SettingRequest = "active/settings/request";
        public const string SettingResponse = "active/settings/response";
        public const string TrackingRequest = "active/project/current/trackingid/request";
        public const string TrackingResponse = "active/project/current/trackingid/response";

        public const string TimeSynchRequest = "active/timesync/get";
        public const string TimeSynchResponse = "active/timesync/status";
        
        public const string KeyLicenseBroadcast = "key/license/status/broadcast";
        public const string ActiveProjectInfo = "active/project/Info";

        public const string DefaultIPAddress = "127.0.0.1:1883";
        public const string SaveSettingsRequest = "active/settings/saverequest";
        public const string TagProcessingDataPublish = "data/raw";

        public const int ReportSingleResponseTimeout = 3 * 1000;
        public const int LicenseCheckTimeout = 60 * 1000;
        public const int TimeSynchCheckTimeout = 3 * 1000;
        public const int TaskTimeout = 3 * 1000;
        public const int CollectSettingsWaitTime = 6 * 1000;
        public const string MultiLevelWildcard = "/#";
        public const string ReplyTo = "/replyto/";
        public const string multiPartTopic = "/multipart/";
        public const string mpartDataIndex = "index/";
        public const string mpartBegin = "begin";
        public const string mpartEnd = "end";
        public const string multiPartIndex = multiPartTopic + mpartDataIndex;
        public const string multiPartBegin = multiPartTopic + mpartBegin;
        public const string multiPartEnd = multiPartTopic + mpartEnd;

        public const int multiPartDefaultChunkSizeInKB = 1 * 1024;

        // MQTT layer connection failure reasons
        public static Dictionary<int, string> MQTTConnectionFailures = new Dictionary<int, string>
        {
            {1, "Unacceptable Protocol Version"},
            {2, "Identifier Rejected"},
            {3, "Server Unavailable"},
            {4, "Bad username or password"},
            {5, "Not Authorized"}
        };

        // Windows TCP layer Error codes
        public static Dictionary<int, string> TCPErrorCode = new Dictionary<int, string>
        {
            {10060, "Server Not Found"},
            {10061, "The Port Does not Exist"},
            {10049, "Invalid Address"}
        };

        public const string MqttconnectionErrorString = "Failed to Connect";
    }

    public static class EncryptionHelperConstants
    {
        public static readonly string DirectoryToSaveKeyAndIv = FilePaths.AppDataPath + FilePaths.Sep + "Ekey";
        public static readonly string PathOfRjindaelKey = DirectoryToSaveKeyAndIv + FilePaths.Sep + "RijKey.txt";
        public static readonly string PathOfRjindaelIv = DirectoryToSaveKeyAndIv + FilePaths.Sep + "RijIv.txt";
        public const string ArgumentNull = "No value Exception";
        public const string RjindaelPassWord = "spiaActive";
        public const int KeySize = 32;
        public const int IvSize = 16;
        public static readonly byte[] SALT = new byte[] { 0x26, 0xdc, 0xff, 0x00, 0xad, 0xed, 0x7a, 0xee, 0xc5, 0xfe, 0x07, 0xaf, 0x4d, 0x08, 0x22, 0x3c };
    }

    public static class CommonConstants
    {
        public const int MINIMUM_SPLASH_SCREEN_TIME = 3000; //Milliseconds
        public const string OrgName = "SPIA";
        public const string ProductName = "I4";
        public const string FileExtension_EXE = ".exe";
        public const string IsCollectServiceUpdateNeededIsTrue = "true";

        public const string CollectServiceName = "CollectServiceCommonBase";

        public const string ProjectExtension = "actproj";
        public static readonly string ProjectExtensionAll = $"*.{ProjectExtension}";
        public const string TrackIdElement = "TrackingId";
        public const string ConfigPathNotConfigured = "PathNotConfigured";

        public const int DefaultRefreshRate = 5; // In Seconds
        public const int MinRefreshRate = 5;
        public const int MaxRefreshRate = 300;
        //public const string RefreshRateErrorMessage = "Value must be Multiple of 1000 and between 1000 & 5000";
        public static readonly string RefreshRateLabelMilliSeconds = $"Refresh{Environment.NewLine}Rate(ms)";
        public static readonly string RefreshRateLabelSeconds = $"Refresh{Environment.NewLine}Rate(s)";
        public const double ScrollVelovity = 0.5;

        // This is needed for backward compatibility of Project
        public const int OldMinRefreshRate = 1000;

        public const bool ControlRestrictionAtEdgeOfDashboardScreen = false;
        public const bool ControlRestrictionAtEdgeOfReportPage = false;

        public const string DefaultLoggerTargetName = "logfileWithRotation";
        public const string WorkbenchLogKey = "Workbench";
        public const string PreviewLogKey = "Preview";
        public const int LogLevelMin = 0; // Trace
        public const int LogLevelMax = 5; // Fatal

        public const Double ReportPageWidth = 794;
        public const Double ReportPageHeight = 1148;
        public const Double XpsFontSize = 12;
        public const Double XPSPageNumberBoxBottomPadding = 20;

        public const int MinutesInAnHour = 60;

        public const int LastHour = 1;
        public const int LastDay = 1;
        public const int DaysforLastWeekAgg = 7;
        public const int DaysforLastMonthAgg = 30;
        public const int DaysforLast3MonthsAgg = 90;
        public const int DaysforLast6MonthsAgg = 180;
        public const int DaysforLastYear = 365;

        public const int MaxNumberofDaysForReport = DaysforLastYear + 1;

        public const string PythonScriptInitFile = "PythonScriptInit.py";
        public static int DoublePrecisionForProperties = 2;

        public const string GetChildProcessQuery = "Select * From Win32_Process Where ParentProcessID=";
        public const string ExplorerApplication = "explorer.exe";

        public const int QueryHardLimit = 10000;
        public const string TagFullyQualifiedNameDelimiter = ".";
        public const int MaxNumberofTagsForBinding = 6;
        public const string DefaultFill = "null";

        //Uptime/Downtime time unit. "1h" for hours, "1s" for seconds.
        public const string IntegralUnit = "1h";
        public const int ProcessWaitForExitTimeout = 5 * 1000; //Milliseconds
        public const string EndOfFile = "ENDOFFILE";
    }

    public static class tsdbConstants
    {
        public const string tsdbAdminUsername = "spiai4admin";
        public const string tsdbAdminPassword = "Collaborate with i4 suite";

        public const string tsdbWriteUsername = "spiai4writeuser";
        public const string tsdbWritePassword = "All your write sensors are mine";

        public const string tsdbReadUsername = "spiai4readuser";
        public const string tsdbReadPassword = "It does not make any sensor";

        public const string realtimeDatabaseName = "active_realtime";
        public const string historicalDatabaseName = "active_historical";

        public const string clearAllTagsQuery = "drop series from TagValues";

        public const string tsdbMeasurementName = "TagValues";
    }

    public static class DatetimeConstants
    {
        public const string DateTimeFormatterString = "yyyy-MM-dd HH:mm:ss.fff";
    }

    public static class PopupChooserConstants
    {
        public const string Fatal = "Fatal";
        public const string Debug = "Debug";
        public const string Error = "Error";
        public const string Info = "Info";
        public const string Trace = "Trace";
        public const string Warning = "Warning";
    }

    public static class ProjectVersions
    {
        public static bool useEnvVarForVersion = true;
        public static string ProductSignature = "SPIAI4SUITE";

        public static string InstallDirEnvName = ProductSignature + "INSTALLDIR";
        public static string InfluxDirEnvName = ProductSignature + "INFLUXDATADIR";
        public static string ProductNameEnvName = ProductSignature + "MANUF";
        public static string ManfuacturerEnvName = ProductSignature + "INSTALLDIR";
        public static string ProductVersionEnvName = ProductSignature + "VERSION";

        public static string localBuildVersion = "0.5.0.5";


        private static AssemblyFileVersionAttribute AttributeVersion = (AssemblyFileVersionAttribute)AssemblyFileVersionAttribute.GetCustomAttribute(
                                              Assembly.GetExecutingAssembly(), typeof(AssemblyFileVersionAttribute));


        public static string GlobalVersion = AttributeVersion.Version;

        public static string ActiveWorkbench = GetVersion(GlobalVersion);
        public static string ActiveWebServer = GetVersion(GlobalVersion);
        public static string ActiveServer = GetVersion(GlobalVersion);
        public static string ActiveRuntimeClient = GetVersion(GlobalVersion);
        public static string CollectConfigurator = GetVersion(GlobalVersion);
        public static string KeyServer = GetVersion(GlobalVersion);
        public static string KeyLicenseServer = GetVersion(GlobalVersion);
        public static string CollectTCPServer = GetVersion(GlobalVersion);
        public static string CollectODBCServer = GetVersion(GlobalVersion);

        private static string GetVersion(string assemblyVersion)
        {
#if DEBUG
            // Debug Builds are always local builds. So use assembly version
            return assemblyVersion;
#else
            // This is release version
            if (assemblyVersion == localBuildVersion)
                // in case it's a local release build.
                return assemblyVersion;
            else if (useEnvVarForVersion)
                // This is set by Installer (WixSharp, MSIEXEC)
                return Environment.GetEnvironmentVariable(ProductVersionEnvName);
            else
                // Using ENV variable is disabled. So fall back to assembly version
                return assemblyVersion;
#endif
        }
    }

    /// <summary>
    /// Constants related to the active settings
    /// </summary>
    public static class SettingsConstants
    {
        public static string GeneralSettingsName = Properties.Resources.RTClientSettingGeneralTabLabel;
        public const string AdvancedSettingsName = "Advanced";

        public const string StartOfWeek = "StartOfWeek";
        public static readonly List<string> Weekdays = new List<string> { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
        public const string DefaultStartOfWeek = "Sunday";
        public const string StartOfWeekDisplayName = "Start of Week";

        public const string SlideShowEnabled = "SlideShowEnabled";
        public const string DefaultSlideShowStatus = "False";
        public const string SlideShowEnabledDisplayName = "Slide Show";

        public const string SlideShowMultiDashboardEnabled = "SlideShowMultiDashboardEnabled";
        public const string DefaultSlideShowMultiDashboardStatus = "False";
        public const string SlideShowMultiDashboardEnabledDisplayName = "Multi Dashboard Slide Show";


        public const string SlideShowInterval = "SlideShowInterval";
        public static readonly List<string> SlideShowIntervals = new List<string> { "3", "5", "10", "15", "20", "30", "40", "50", "60", "120", "150", "180" };
        public const string DefaultSlideShowInterval = "3";
        public const string SlideShowIntervalDisplayName = "Slide Show Interval (Seconds)";


        //In Seconds
        public const int SlideShowIntervalMin = 2;
        //In Seconds
        public const int SlideShowIntervalMax = 600;
        //Used to convert Seconds to Milliseconds
        public const int SlideShowIntervalMultiplicationFactor = 1000;


    }

    /// <summary>
    /// This class contains constants for collect.ui.
    /// </summary>
    public static class CollectUiConstants
    {
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "Collect-x-ConfiguratorConfig.xml";
        public const string AlphaNumericValidation = @"^[ A-Za-z0-9_-]*$";

        //Below regular expression for GUID taken from http://www.geekzilla.co.uk/View8AD536EF-BC0D-427F-9F15-3A1BC663848E.htm
        public const string DeveloperIdValidation = @"^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$";

        public static readonly int tagNameMaxLength = 128;
        public static readonly string groupCopyKeyWord = "-Copy-";

        public const string importTitle = "Select File To Import";
        public const string defaultFileName = "CollectTaginfo";
        public const string taginfoFileNameSeparator = "-";
        // Change this if you want to change the extension of the collect tag INFO file
        public const string defaultExtension = "i4tags";
        public static readonly string exportImportFilter = $"i4 Tags Files (*.{defaultExtension})|*.{defaultExtension}";
        public const string exportFileNameDateFormat = "ddMMyyyy-HHmmss";
        public const string importJezanDateFormat = "dd-MM-yyyy HH:mm:ss";

        // This is needed to Unzip the file. So this MUST NOT be changed
        public const string zipExtension = "zip";
        public const string MetaInfoDateFormat = "MM/dd/yyyy HH:mm:ss zzz";

        // Import / Export related 
        public static readonly bool AddMetadataInTagInfo = true;
        public static readonly char TagInfoComment = '#';
        public const int MqttRetryCount = 1;
        public const int MqttWaitPeriod = 200;
        public const string TagMaxLimitExceededMessage_Clone = "Cannot clone the group as it will exceed the tags max limit";
        public const string TagMaxLimitExceededMessage_Add = "Cannot add a new tag as it will exceed the tags max limit";
    }

    public static class CollectCommonConstants
    {
        //Time out and retry count Collect will use to wait for Settings. The settings should come from 
        // Key server via MQTT. 
        #region Settings constants.
        public static readonly int settingsTimeout = 3 * 1000; // Milliseconds
        public static readonly int settingRetryCount = 60;
        public static readonly string settingsUsername = AppNameConstants.CollectName;
        public static readonly string settingsPollingRateFieldName = "PollingRate";
        public static readonly string settingsLoggingRateFieldName = "LoggingRate";
        public static readonly string settingsPreferredDeviceTypeFieldName = "PreferredDeviceType";
        public static readonly string settingsPollingRateDisplayName = "Polling Rate (Seconds)";
        public static readonly string settingsLoggingRateDisplayName = "Logging Rate (Seconds)";
        public static readonly string settingsPreferredDeviceTypeDisplayName = "Preferred Device Type";
        public static readonly double defaultPollingRateSeconds = 5;
        public static readonly double defaultLoggingRateSeconds = 5;
        public static readonly int settingMinInterval = 1;
        public static readonly int settingMaxInterval = 10 * 60 * 60;
        public static readonly string settingsIntegerValidationMessage = "Input should be a positive integer.";
        public static readonly string settingsMaxIntervalValidationMessage = $"Intervals should be between 0 and {settingMaxInterval} seconds.";
        public static readonly string settingsRelationValidationMessage = $"Logging Rate should be a multiple of Polling Rate.";
        #endregion

        public const string Talk2MName = "Talk2M";
        public const string AccountRefreshNeeded = "AccountRefreshNeeded";

        public static readonly string DeviceTypeNameNone = "None";
        public static readonly string DeviceTypeNameModbusTcp = "Modbus TCP";
        public static readonly string DeviceTypeNameOdbc = "ODBC";
        public static readonly string DeviceTypeDisplayNameTalk2m = $"{Talk2MName} DMBox";

        public static readonly string DeviceSignatureDefault = "NOSIGNATURE";
        public static readonly string DeviceSignatureModbusTcp = "MODTCP";
        public static readonly string DeviceSignatureOdbc = DeviceTypeNameOdbc;
        public static readonly string DeviceSignatureModbusRtu = "MODRTU";
        public static readonly string DeviceSignatureMaster = "COLLECT-MASTER";
        public static readonly string DeviceSignatureTalk2M = $"{Talk2MName}";
        public static readonly string DevicesTab = "Devices";
        public static readonly string TagsTab = "Tags";
        public static readonly string SettingsTab = "Settings";

        //Logger names
        public static readonly string DefaultLoggerName = "DefaultLogger";
        public static readonly string InfluxLoggerName = "InfluxLogger";


        public enum CollectTabNames
        {
            Devices = 0,
            Tags = 1,
            Settings = 2,
        }

        public static readonly string DefaultStatus = "OK";

        /// <summary>
        /// Temporary value set for odbc datatype.
        /// </summary>
        public static readonly string OdbcTagDataType = "Odbc Float";

        public static readonly string DeviceTypeNameTalk2m = $"{Talk2MName}";

        public const int DelaybtwProcessStarts = 100;

        #region Database Error messages
        public static readonly string DatabaseFailureMessage = "Database Failure";
        public static readonly string DatabaseErrorMessage = "Database Disconnected";
        public static readonly string DatabaseErrorMessageColor = "Red";
        public static readonly string DatabaseSuccessMessage = "Database Connected";
        public static readonly string DatabaseSuccessMessageColor = "Green";
        public static readonly string DatabaseResetMessage = string.Empty;
        public static readonly string DatabaseResetMessageColor = "White";

        public static readonly string DBErrorPopupMessage = "Database error occured while loading Collect-x. Please try again.";
        public static readonly string InitErrorPopupMessage = "Initialisation error occured while loading Collect-x. Please try again.";
        public static readonly string SettingsErrorPopupMessage = "Failed to recieve settings while loading Collect-x.  Please try again.";

        public static readonly string DBErrorPopupCaption = "Collect-x Database Error";
        public static readonly string InitErrorPopupCaption = "Collect-x Initialisation Error";
        #endregion

        public const string CollectAppName = "Collect-x Configurator"; //Collect Application Name (.exe name)
        public const string CollectAppUIName = AppNameConstants.CollectConfiguratorName;

        // Modbus related contstants
        public static readonly int normalModbusAddressDigits = 5;
        public static readonly int extendedModbusAddressDigits = 6;
        public static readonly int multiplicationFactorMaxDigits = 10;

        // In Modbus address convention Address starts from 1 and ends at 65536 (in device documents etc)
        // As per the protocol it's 0 to 65535. So internally we will do an adjustment
        public static readonly int modbusAddressMin = 1;
        public static readonly int modbusAddressMax = UInt16.MaxValue + 1;

        public static readonly int slaveIDModbusMin = 1;
        public static readonly int slaveIDModbusMax = 247;
        public static readonly int defaultMultiplicationFactor = 1;

        public static readonly string clearTagValueSuccessMessage = "All Tag data points purged.";
        public static readonly string clearTagValueFailMessage = "Please try again!";
        // Purge related delays and timeouts
        public static readonly int clearTagValueResponseForcedWait = 4 * 1000; //in milliseconds
        public static readonly int clearTagValueRequestTimeOut = 120 * 1000; //in milliseconds
        public static readonly int refreshTimeout = 25 * 1000; // In Milli Seconds

        public static readonly int waitIntervalBeforePurge = 4 * 1000;
        //This constant is used to set the time for which the response message should be visible after clearAllTag Button Action in settings 
        public static readonly int clearTagValueMessageTimeOut = 3 * 1000;//in milliseconds
        //This constant is used to set the warning message displayed in the message box when clearing all tag data
        public static readonly string clearTagValuePopupMessage = "You will lose all your historical data." + Environment.NewLine + "Do you want to continue?";
        public static readonly string DataSourceSuffix = "Data Source";

        //Stored Procedure names for Different Tables in Collect Database
        public const string deviceStoredProcedure = "Sp_Device";
        public const string groupStoredProcedure = "Sp_GroupMaster";
        public const string tagStoredProcedure = "Sp_Tag";
        public const string accountStoredProcedure = "Sp_Account";
        //Collect Table Names
        public const string deviceTableName = "tbl_Device";
        public const string groupTableName = "tbl_GroupDetails";
        public const string tagTableName = "tbl_Tag";
        public const string accountTableName = "tbl_Account";

        public const string pathTooLongMsg = "Selected file path is too long";
        public const string noDataInFileMsg = "No data in the selected file! Select a valid file";
        public const string importDoneMsg = AppNameConstants.CollectName + " configuration imported successfully";
        public const string importTimeFormatErrorMsg = "Time format in the selected file is unexpected";
        public const string importFailedMessage = "Importing " + AppNameConstants.CollectName + " configuration failed..!";
        public const string exportDoneMsg = "Successfully exported " + AppNameConstants.CollectName + " configuration";
        public const string exportFailedMsg = "Exporting " + AppNameConstants.CollectName + " configuration failed!";
        public const string fileInvalidMsg = "INVALID filename, Please select the right file..!";

        public const string pathEmptyMsg = "Target file path is empty";
        public const string zipFileOpenFailedMsg = "Zip file opening failed";

        //Add All table names to the list - This list is used to import and export tables in collect database
        //Please note that this is the order in which the tables are imported
        public static readonly IList<string> databaseTableList = new List<string>() {accountTableName,
                                                                                     deviceTableName,
                                                                                     groupTableName,
                                                                                     tagTableName };

        public const string talk2mGroupId = "22222222-2222-2222-2222-222222222222";

        public const string talk2mGroupName = Talk2MName + "-";

        public const string talk2mDeviceListHeaderName = Talk2MName + " Account";

        public const string talk2mDataSourceName = Talk2MName + " Device";

        public const string talk2mDefaultDeviceName = "eWON";

        public const string talk2mAPIUrl = "https://data.talk2m.com";

        public const double StatusCheckInterval = 3 * 1000;       // In Milli seconds

        public static readonly string talk2M_DB_Path = Path.Combine(FilePaths.AppDataPath, AppNameConstants.CollectName);

        public const string talk2M_DBName = Talk2MName;

        public const string talk2M_Id = "TransactionId";

        public const string talk2M_DateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'";

        public const string talk2MServerDescription = "Collect Talk2M Server Test Service for debugging";

        public const string talk2MServerDisplayName = "Collect Talk2M Server Test";

        public const string talk2MServerServiceName = "CollectTalk2MServerTest";

        public static readonly string talk2MConfigPath = Path.Combine(FilePaths.ConfigPath, "Collect-x-Talk2MServerConfig.xml");

        public const string deleteButtonName = "btnDelete";

        public const string deleteButtonDisplayText = "Delete";

        public const string cloneButtonName = "btnClone";

        public const string cloneButtonDisplayText = "Clone";

        public const string editButtonName = "btnEdit";

        public const string editButtonDisplayText = "Edit";

        public const string accountHeaderName = "Account Name";

        public const string eWONHeaderName = "eWON Name";

        public const string internetNotAvailableMessage = "Please check your Internet Connection! Talk2M Devices and Tags can be added only when Internet is Available";

        public const string wrongAccountInfoMessage = "Please check your Account Information! Wrong details provided.";

        public const string KeySeparator = "_";

        public const string Talk2MTagRequestType1 = "getdata";

        public const string Talk2MTagRequestType2 = "getewon";

        public const string DataSourc_MSSQL = "MSSQL";
        public const string DataSourc_MQTT = "MQTT";
        public const int BaseAddressMulFactor = 10000;
        
        public const string ModTCPDataType_Int16 = "Integer (16 bit)";
        public const string ModTCPDataType_Int32 = "Integer (32 bit)";
        public const string ModTCPDataType_Float = "Float";
        public const string ModTCPDataType_Double = "Double";
        public const string ModTCPDataType_Bool = "Bool";

        public const string ModTCPRegType_Coil = "Coil (0)";
        public const string ModTCPRegType_Input = "Input (1)";
        public const string ModTCPRegType_InputRegister = "Input Register (3)";
        public const string ModTCPRegType_HoldingRegister = "Holding Register (4)";

        public const string ModTCP_DevcieTypeName = "modbustcp";

        public const string JTagName_devices = "devices";
        public const string JTagName_deviceid = "id";
        public const string JTagName_ipaddress = "ip";
        public const string JTagName_slaveid = "slaveid";
        public const string JTagName_port = "port";
        public const string JTagName_devicename = "name";
        public const string JTagName_deviceTypeId = "deviceTypeId";
        public const string JTagName_readtimeout = "readtimeout";
        public const string JTagName_waittoretry = "waittoretry";
        public const string JTagName_devicetimeout = "devicetimeout";
        public const string JTagName_retrycount = "retrycount";
        public const string JTagName_registertype = "registertype";
        public const string JTagName_datatype = "datatype";
        public const string JTagName_TagId = "id";
        public const string JTagName_tags = "tags";
        public const string JTagName_tagname = "name";
        public const string JTagName_offset = "offset";
        public const string JTagName_ParentFullName = "parentFullName";


        public static readonly string DeviceRegistration_MODTCP = @"{
	'version': '1',
	'id': '"+ ModTCP_DevcieTypeName + @"',
	'name': '" + ModTCP_DevcieTypeName + @"',
	'displayName': 'Modbus TCP Devices',
		'properties': [
			{
				'name': '" + JTagName_ipaddress + @"',
				'displayname': 'IP Address',
				'type': 'string',
				'required': true,
				'showintable': true,
				'default': '',
				'validations': [
					{
						'minLength': 7,
						'maxLength': 16,
						'validRegex': '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
						'invalidRegex': '^0.0.0.0$'
					}
				]
			},
			{
				'name': '" + JTagName_port + @"',
				'displayname': 'Port',
				'type': 'number',
				'required': true,
				'showintable': true,
				'default': 502,
				'validations': [
					{
						'minValue': 1,
						'maxValue': 65535,
						'validRegex': '^[0-9]{3,5}$',
						'invalidRegex': '^0$'
					}
				]
			},
			{
				'name': '" + JTagName_slaveid + @"',
				'displayname': 'Slave ID',
				'type': 'number',
				'required': true,
				'showintable': true,
				'default': 1,
				'validations': [
					{
						'minValue': 1,
						'maxValue': 247,
						'validRegex': '^[0-9]{1,3}$',
						'invalidRegex': '^$'
					}
				]
			},
			{
				'name': '" + JTagName_devicetimeout + @"',
				'displayname': 'Device Timeout (ms)',
				'type': 'number',
				'required': true,
				'showintable': false,
				'default': 3000,
				'validations': [
					{
						'minValue': 0,
						'maxValue': 10000,
						'validRegex': '^[0-9]{1,5}$',
						'invalidRegex': '^$'
					}
				]
			},
			{
				'name': '" + JTagName_retrycount + @"',
				'displayname': 'Retry Count',
				'type': 'number',
				'required': true,
				'showintable': false,
				'default': 3,
				'validations': [
					{
						'minValue': 0,
						'maxValue': 10,
						'validRegex': '^[0-9]{1,3}$',
						'invalidRegex': '^$'
					}
				]
			},
			{
				'name': '" + JTagName_waittoretry + @"',
				'displayname': 'Wait to Retry (ms)',
				'type': 'number',
				'required': true,
				'showintable': false,
				'default': 0,
				'validations': [
					{
						'minValue': 0,
						'maxValue': 10000,
						'validRegex': '^[0-9]{1,5}$',
						'invalidRegex': '^$'
					}
				]
			},
			{
				'name': '" + JTagName_readtimeout + @"',
				'displayname': 'Read Timeout (ms)',
				'type': 'number',
				'required': true,
				'showintable': false,
				'default': 1000,
				'validations': [
					{
						'minValue': 1,
						'maxValue': 10000,
						'validRegex': '^[0-9]{1,5}$',
						'invalidRegex': '^$'
					}
				]
			}
		]
	}";

	public const string TagRegistration_MODTCP = @"{
		'version': '1',
		'name': 'modbustcptag',
		'displayname': 'Modbus TCP Tags',
		'devicetype': 'modbustcp',
		'properties': [
			{
			  'name': '" + JTagName_registertype + @"',
			  'displayname': 'Register Type',
			  'type': 'enum',
			  'required': 'true',
			  'showintable': true,
			  'default': '" + ModTCPRegType_HoldingRegister + @"',
			  'options': [
				  '" + ModTCPRegType_HoldingRegister + @"',
				  '" + ModTCPRegType_InputRegister + @"',
				  '" + ModTCPRegType_Input + @"',
				  '" + ModTCPRegType_Coil + @"'
			  ]
			},
			{
			  'name': '" + JTagName_offset + @"',
			  'displayname': 'Offset',
			  'type': 'number',
			  'required': 'true',
			  'showintable': true,
			  'default': 0,
			  'validations': [
                  {
				      'minValue': 1,
				      'maxValue': 65536,
				      'validRegex': '^[0-9]{1,5}$',
				      'invalidRegex': '^$'
			      }
                ]
			},
			{
			  'name': '" + JTagName_datatype + @"',
			  'displayname': 'Data Type',
			  'type': 'enum',
			  'required': 'true',
			  'showintable': true,
			  'default': '" + ModTCPDataType_Int16 + @"',
			  'options': [
				  '" + ModTCPDataType_Int16 + @"',
				  '" + ModTCPDataType_Int32 + @"',
				  '" + ModTCPDataType_Float + @"',
				  '" + ModTCPDataType_Double + @"',
				  '" + ModTCPDataType_Bool + @"'
			  ]
			},
			{
			  'name': 'swapped',
			  'displayname': 'Swapped',
			  'type': 'checkbox',
			  'required': true,
			  'showintable': true,
			  'default': true
			}
		]
	}";
    }

    public static class ActiveModelConstants
    {
        //mathord ActiveSerializerBinding
        public const string DefaultFunction = "Last";

        public const string DefaultAggregation = "Hourly";

        //methord ControlTimePeriodResourceLoader
        public const string ResourceStringPrefix = "ControlTimerPerod_";

        public const string differenceFunction = "Difference";

        public const string SelectedFunctionProperty = "SelectedFunction";

        public const string SelectedControlPeriodProperty = "SelectedControlPeriod";

        public const string SelectedAggregationProperty = "SelectedAggregation";

        public const string SelectedAggregationUnitProperty = "AggregationUnit";

        public const string SelectedAggregationIntervalProperty = "AggregationInterval";

        public const string LabelProperty = "Label";

        public const string SliceLabelpositionProperty = "SliceLabelposition";

        public const string AllControlBindInfo_FileName = "ProjectAllControlBindInfo.xml";
        public const string ReportControlBindInfo_FileName = "ProjectReportControlBindInfo.xml";

    }

    public static class ButtonTexts
    {
        /// <summary>
        /// Button Texts for Collect Configurator Left Sidepanel
        /// </summary>
        public const string DevicesButtonTXT = "Data Source";
        public const string TagsButtonTXT = "Tags";
        public const string SettingsButtonTXT = "Settings";
    }

    public static class CommonToolTipConstants
    {
        //Modbus TCP Add Data Source
        public const string ModBusAddButtonTT = "Add Data Source";
        //ODBC Add Data Source
        public const string OdbcAddButtonTT = "Add Data Source";
        //Modbus TCP Delete Button
        public const string DeleteTcpTT = "Delete Data Source";
        //ODBC Delete Button
        public const string DeleteOdbcTT = "Delete Data Source";
        //Talk2M Add Account
        public const string Talk2MAddAccountTT = "Add Account";

        public const string ExportToPDFTT = "Export To PDF";
    }

    public static class LicenseConstants
    {
        public const string Valid = "valid";
        public const string Invalid = "invalid";
        public const string Enabled = "enabled";

        public const string DongleNotFound = "notfound";
        public const string DongleFound = "found";
        public const string LicenseTypeDemo = "DEMO";

        public const string RabbitMQServerName = "RabbitMQ";
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "KeyLicenseServerConfig.xml";
        public const bool IsEncryptionEnabled = true;

        public const double GracePeriodIntervalMinutes = 60;
        public const double GracePeriodInterval = GracePeriodIntervalMinutes * 60 * 1000;  // In Milli seconds

        public const string LicenseHistoryFilepath = FilePaths.AppDataPath + FilePaths.Sep + @"KeyManager\LState.db";
        public const string LicenseHistoryUsername = "KeyLicense";
        public const string LicenseHistoryTabelname = "LicenseState";


        //This is the SDSN assigned by Dinkey for our Company
        public const int MY_SDSN = 12968;
        //Product code assigned in our dongle from DinkeyAdd
        public static readonly string MY_PRODCODE = CommonConstants.OrgName + CommonConstants.ProductName;
        public const int INVALID_TAGCOUNT = -1;

        //The dongle data (in bytes) should be of minimum this size else exception occurs
        public const int readFromDongleByteSize= 1000;
        public const int FreeTags = 25;
        public const bool IsFreeTierTagsEnabled = false;

        public const bool IsSoflicenseEnabled = true;
        public const string CopyMinderDllName = @"..\Licensing\i4suite-licence-lib-64.dll";

        public const bool MORE_SECURE_FLAG = true;
        public const int EXPECTED_ALGORITHM_RESULT = -4546775;
        public const string PRODUCT_CODE = "I4SUITE-2020";
        public const int FEATURES = 4;
        public static readonly int[] VALUES = new int[] { 5556565, 23433243, 78797997, 9987778, 4546775, 3345464, 1157866, 56565658, 64627784, 9764315,
                                            667589, 8876547, 6663444, 1389769, 56356454 };
        public static readonly int PRODCODE_LENGTH = PRODUCT_CODE.Length;
        public const double KeyLicenseBroadcastInterval_SoftLic = 24 * 60 * 60 * 1000;       //One day - In Milli seconds
        public const double KeyLicenseBroadcastInterval_Dongle = 30 * 1000;       // In Milli seconds
        public const double KeyLicenseBroadcastInterval_Default = 5 * 1000;       // In Milli seconds

        public const string KeyBroadcastClientName = "Key Licence Broadcast";
        public const string GracePeriodInfoClientName = "Grace Period Info";

        public const double LicenseCheckIntervalNormal = 3 * KeyLicenseBroadcastInterval_SoftLic;       // In Milli seconds
        // In Grace period we need a faster License check
        public const double LicenseCheckIntervalGracePeriod = 1.5 * KeyLicenseBroadcastInterval_SoftLic;  // In Milli seconds
        public const double GracePeriodInfoTimerInterval = 60 * 1000;  // In Milli seconds

        public const string LicenceNotFound_Msg = "Licence not found.";
        public static readonly Dictionary<int, string> SoftLicenseErrorMessages = new Dictionary<int, string>()
        {
            {25, LicenceNotFound_Msg },
            {81, LicenceNotFound_Msg },
            {671, LicenceNotFound_Msg },
            {717, LicenceNotFound_Msg },
            {775, LicenceNotFound_Msg },
            {1968, LicenceNotFound_Msg },
            {758, "Your licence is expired." },
            {737, "Your licence is disabled." },
            {7, "Failed to connect to licence portal." },
            {739, "Licence duplication detected." },
            {810, "Licence email validation pending." },
            {947, "Your licence is invalid." }
        };
    }


    /// <summary>
    /// This class contains constants for collect.service.odbc.
    /// </summary>

    public static class CollectMasterServiceConstants
    {
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "Collect-x-MasterServerConfig.xml";

        public const string ServiceName = "Collect-x-MasterServer";
        public const string TestServiceName = ServiceName + "Test";
        public const string TestServiceDisplayName = "Collect-x Master Server Test";
        public const string TestServiceDescription = "Collect-x Master Server Test Service for debugging";
    }


    /// <summary>
    /// This class contains constants for collect.service.
    /// </summary>
    public static class CollectServiceConstants
    {
        public const string ServiceName = "Collect-x-ModbusTCPServer";
        
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + ServiceName + "Config.json";
        public const string TestServiceName = ServiceName + "Test";
        public const string TestServiceDisplayName = "Collect-x ModbusTCP Server Test";
        public const string TestServiceDescription = "Collect-x ModbusTCP Server Test Service for debugging";

        public const string exMessage_RegisterType = "Enter a valid starting number";
        public const string exMessage_DataType = "Enter a valid datatype";

        public const int MF_Default = 1;
        
    }

    public static class CollectModbusRTUServiceConstants
    {
        public const string TestServiceName = "Collect-x-ModbusRTUServerTest";
        public const string TestServiceDisplayName = "Collect-x ModbusRTU Server Test";
        public const string TestServiceDescription = "Collect-x ModbusRTU Server Test Service for debugging";
    }

    public static class CollectODBCServiceConstants
    {
        public const string TestServiceName = "Collect-x-ODBCServerTest";
        public const string TestServiceDisplayName = "Collect-x ODBC Server Test";
        public const string TestServiceDescription = "Collect-x ODBC Server Test Service for debugging";
    }

    /// <summary>
    /// This class contains constants for collect.service.odbc.
    /// </summary>
    public static class CollectOdbcConstants
    {
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "Collect-x-ODBCServerConfig.xml";
    }

    public static class LicenseServerConstants
    {
        public const string TestServiceName = "KeyLicenceServerTest";
        public const string TestServiceDisplayName = "Key Licence Server Test";
        public const string TestServiceDescription = "Key Licence Test Service for debugging";
    }

    /// <summary>
    /// Key Constants status Messages
    /// </summary>
    public static class KeyConstants
    {
        public const string Success = "Success";
        public const string Failed = "Failed";
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "KeyServerConfig.xml";
        public static readonly string SettingsFilePath = Path.Combine(FilePaths.AppDataPath, "KeyManager");
        public static readonly string CredentialsDBName = "Credentials.db";
        public const string Salt = "qS0F5cJpNGP8kr3VRPfa7vvIbJaFZCjQj65Ap5pSkG7tZldjsTL3stCWY8hv3wgv";
        public const bool IsEncryptionEnabled = true;

        public const string TestServiceName = "KeyServerTest";
        public const string TestServiceDisplayName = "Key Server Test";
        public const string TestServiceDescription = "Key Test Service for debugging";

        public const string MqttBrokerSTARTCompletion = "completed with 2 plugins";
        public const string MqttBrokerSETUPCompletion = "RabbitMQ SETUP Completed";
    }

    public static class AlertServerConstants
    {
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + "AlertServerConfig.xml";
    }

    public static class ActiveServiceHostConstants
    {
        public const string ServiceName = "Active-tServerDebug";
        public const string ConcatString = " = ";
        public const string DisplayName = "Active-t RT Server";
        public const string ServiceProcessName = "Active-tService";
        public const string ServiceInstallerName = "Active-tServerTest";
        public const string ServiceInstallerDisplayName = "Active-tServerTest";
        public const string ServiceInstallerDescription = "Active-t Service for debugging";
        public const string ActiveServerConfigurationFileName = "Active-t-RTServerConfig.xml";
        public static readonly string ConfigPath = FilePaths.ConfigPath + FilePaths.Sep + ActiveServerConfigurationFileName;
        public const string ProjectRefreshResponseMessage = "Refresh Done";
        public const string ReadyFileName = @"\Ready.txt";
        public const int LogMessageCharSizeLimit = 1024 * 1;
        public const int LogMessageCharSizeMaxLimit = 1024 * 10;
    }

    public static class AuthenticationWindowLabels
    {
        public const string UsernameBoxText = "Username";
        public const string ServerAddressBoxText = "RT Server";
        public const string PasswordBoxText = "Password";
    }
}
