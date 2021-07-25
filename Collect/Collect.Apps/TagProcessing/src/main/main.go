//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package main

import (
	config "spiatech.com/TagProcessing/v1/configuration"
	"spiatech.com/TagProcessing/v1/processdata"
//	"delay"
	"spiatech.com/TagProcessing/v1/globalconstants"
	"spiatech.com/TagProcessing/v1/mqttwrapper"
	"os"
	"runtime"
//	"strconv"
	"strings"
//	"sync"
	"time"
    MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/natefinch/lumberjack"
	log "github.com/sirupsen/logrus"
	"github.com/tkanos/gonfig"
)

//configuration variable
var Config config.Configuration = config.Configuration{}

var logger = log.WithFields(log.Fields{
	"App": config.ConfigurationName,
})


var BasePath string = ""
var ProductVersion string = ""
var Client MQTT.Client


//initialization
//We read all configurations inside init
func init() {

	BasePath = os.Getenv("SPIAI4SUITEINSTALLDIR")
	BasePath = strings.ReplaceAll(BasePath, `\`, `/`)

	ProductVersion = os.Getenv("SPIAI4SUITEVERSION")
	//Setting Log properties
	SetLogProperties()

	logger.Info("Reading configurations")
	var readConfigStatus bool = ReadConfigurations()

	if readConfigStatus {

		logger.Info("Reading  configuration completed")

	} else {

		logger.Error("Reading configuration Failed!")

	}

	Client = mqttwrapper.MqttClient(
       Config.Mqttbroker,
       globalconstants.MqttClientID,
       globalconstants.MqttUsername,
       globalconstants.MqttPassword,
       globalconstants.MqttCleanSession,
       logger)

	mqttwrapper.MqttSubscribe(Client, globalconstants.DataTopic, &DataIncoming, logger)

}

//Main Function
func main() {

	ticker := time.NewTicker(1000 * time.Millisecond)

	logger.Info("Starting application")
	// time to use our logger, print version, processID and number of running process
	logger.Info("TagProcessing v", ProductVersion, " , pid=", os.Getpid(), ", started with processes:", runtime.GOMAXPROCS(runtime.NumCPU()))

    processdata.Init(Config.Tsdbserver, logger)

	//The application will run until Control+C is pressed or Application is closed
	for _ = range ticker.C {
		logger.Info("TagProcessing running")
	}

}

//Function to set log properties
func SetLogProperties() {

	// Log as JSON instead of the default ASCII formatter.
	//log.SetFormatter(&log.JSONFormatter{})
	log.SetFormatter(&log.JSONFormatter{})

	// Output to stdout instead of the default stderr
	// Can be any io.Writer, see below for File example
	log.SetOutput(os.Stdout)

	// Only log the warning severity or above.
	log.SetLevel(log.InfoLevel)

	log.SetReportCaller(true)

	log.SetOutput(&lumberjack.Logger{
		Filename:   globalconstants.LogPath,
		MaxSize:    globalconstants.MaxSizeofLogFiles, // megabytes
		MaxBackups: globalconstants.MaxNumberofLogFiles,
	})
}

//Function to read all configurations
func ReadConfigurations() bool {
	//Reading configuration
	ConfigError := gonfig.GetConf(globalconstants.ConfigurationPath, &Config)
	if ConfigError != nil {
		logger.Error("Reading config failed! ", ConfigError)
		//fmt.Println(err)
		//os.Exit(500)
		return false
	}

	logger.Info("Version:", Config.Version)

	return true
}

var DataIncoming MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {

	logger.Info("New message received on topic ", string(msg.Topic()))
	payload := string(msg.Payload())
	logger.Info("Message: ", payload)
    processdata.ProcessData(payload, logger)

}


