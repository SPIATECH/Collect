//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package globalconstants
import (
    "runtime"
)
// Helper function to detect OS and return the root folder correctly
func getroot()  (string){
    var Root = ""
    if runtime.GOOS == "windows" {
        Root = "C:/"
    } else {
       Root = "/opt/"
    }
    return  Root
}

var AppName = "CloudSynchIIoTNext"
var Version = "0.1"
var Drive = getroot()
var SpiaFolder = "SPIA"
var LogPath = Drive + SpiaFolder + "/Logs/Collect.Apps/" + AppName + "/" + AppName + "Log.txt"
var ConfigurationPath = Drive + SpiaFolder + "/Config/" + AppName + "Config.json"
var CloudSynchConfigPath = Drive + SpiaFolder + "/AppData/" + AppName + "/" + "SynchConfig.json"
var CloudSyncDBPath = Drive + SpiaFolder + "/AppData/" + AppName + "/" + AppName + "db"
var CloudSyncLastValueHistoryDBPath = Drive + SpiaFolder + "/AppData/" + AppName + "/" + AppName + "db" + "/" + "LastValueHistorySync"

var IIoTNextAPIUrl = "/api/v1/"
var DefaultDelta = "5s"
var DefaultDeltaInMilliseconds = 5000
var Seconds = 5
var TelemetryType = "telemetry"
var AttributeType = "attribute"
var LastValueMode = "last"
var HistoricalMode = "historical"

var IIoTNextTelemetryApiUrlParam = "/telemetry"
var IIoTNextAttributeApiUrlParam = "/attributes"
var QueryToReadLastValuePart = "select time,VALUE from TagValues where TAGID='" 
var QueryToReadLastValueDeltaTime = "' and time > now()-"
var QueryToReadLastValueDefaultTime = QueryToReadLastValueDeltaTime + DefaultDelta
var QueryToReadValueOrderbyLimit1 = " order by time desc limit 1"
var QueryToReadLastValueHistoricalTimePart1 = "' and time > "
var QueryToReadLastValueHistoricalTimePart2 = " and time < "
var QueryToReadValueOrderbyWithoutLimit = " order by time asc limit "

var MillisecondtoNanoSecond = 1000000
var MillisecondtoNanoSecondDecimalValue = 10
var MaxNumberofLogFiles = 20
var MaxSizeofLogFiles = 10 //In MB

var TopicRoot = "spiai4suite"

var MqttUsername = "spiai4user"
var MqttPassword = "All your sensors are mine"
var MqttCleanSession = true
var MqttNoOfMessages = 1


var CollectDatabase = "active_realtime"
var CollectHistoricalDatabase = "active_historical"
var CollectRetentionPolicy = "Pol_RP"

var TSDBUsername = "spiai4writeuser"
var TSDBPassword = "All your write sensors are mine"

