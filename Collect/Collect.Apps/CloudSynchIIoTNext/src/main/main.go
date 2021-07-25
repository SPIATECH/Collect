//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package main

import (
	config "spiatech.com/CloudSynchIIoTNext/v1/configuration"
	"spiatech.com/CloudSynchIIoTNext/v1/globalconstants"
	"os"
	"runtime"
	"strings"
	"time"
	"fmt"
	"github.com/natefinch/lumberjack"
	log "github.com/sirupsen/logrus"
	"github.com/tkanos/gonfig"
	"spiatech.com/CloudSynchIIoTNext/v1/iiotnext"
	"github.com/syndtr/goleveldb/leveldb"
)

//configuration variable
var Config config.Configuration = config.Configuration{}

var logger = log.WithFields(log.Fields{
	"App": config.ConfigurationName,
})


var BasePath string = ""
var ProductVersion string = ""


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
        return
	}  

	// The returned DB instance is safe for concurrent use. Which mean that all
	// DB's methods may be called concurrently from multiple goroutine.
	db, err := leveldb.OpenFile(globalconstants.CloudSyncDBPath, nil)
	if err!= nil {
		logger.Error("Error opening db file.",err)
		return
	}
	defer db.Close()

}

//Main Function
func main() {

	ticker := time.NewTicker(5000 * time.Millisecond)

	logger.Info("Starting application")
	// time to use our logger, print version, processID and number of running process
	logger.Info("CloudSynchIIoTNext v", ProductVersion, " , pid=", os.Getpid(), ", started with processes:", runtime.GOMAXPROCS(runtime.NumCPU()))
	db, dbErr := leveldb.OpenFile(globalconstants.CloudSyncDBPath, nil)
	
	if dbErr!= nil {
		logger.Error("Error opening db file.",dbErr)
		return
	}
	iiotnext.SyncValueWithIIoTNext(db, Config, logger)

	//The application will run until Control+C is pressed or Application is closed
	for _ = range ticker.C {
		logger.Info("Cloud Synch IIotNext running")
		fmt.Println("Cloud Synch IIotNext running")
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

	logger.Info("Tsdbserver:", Config.Tsdbserver)

	return true
}

