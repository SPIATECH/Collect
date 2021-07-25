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
var AppName = "TagProcessing"
var Version = "0.1"
var Drive = getroot()
var SpiaFolder = "SPIA"
var LogPath = Drive + SpiaFolder + "/Logs/Collect.Apps/" + AppName + "/" + AppName + "Log.txt"
var ConfigurationPath = Drive + SpiaFolder + "/Config/" + AppName + "Config.json"

var MaxNumberofLogFiles = 20
var MaxSizeofLogFiles = 10 //In MB

var TopicRoot = "spiai4suite"

var MqttUsername = "spiai4user"
var MqttPassword = "All your sensors are mine"
var MqttCleanSession = true
var MqttNoOfMessages = 1


var CollectDatabase = "active_realtime"
var CollectRetentionPolicy = "Pol_RP"

var TSDBUsername = "spiai4writeuser"
var TSDBPassword = "All your write sensors are mine"

