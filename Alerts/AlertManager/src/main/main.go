//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package main

import (
	"os"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"spiatech.com/AlertManager/v1/alertconfig"
	"spiatech.com/AlertManager/v1/alertoperations"
	config "spiatech.com/AlertManager/v1/configuration"
	"spiatech.com/AlertManager/v1/delay"
	"spiatech.com/AlertManager/v1/globalconstants"
	"spiatech.com/AlertManager/v1/mqttwrapper"
	sms "spiatech.com/AlertManager/v1/smsconfig"
	smtp "spiatech.com/AlertManager/v1/smtpconfig"
	"spiatech.com/AlertManager/v1/tagconfig"

	"github.com/Jeffail/gabs"
	MQTT "github.com/eclipse/paho.mqtt.golang"
	"github.com/natefinch/lumberjack"
	log "github.com/sirupsen/logrus"
	"github.com/tkanos/gonfig"
)

//AlertManager configuration variable
var Alertmanagerconfig config.Configuration = config.Configuration{}

//SMTP configuration variable
var Smtpconfig smtp.SMTPConfiguration = smtp.SMTPConfiguration{}

//SMS configuration variable
var Smsconfig sms.SMSConfiguration = sms.SMSConfiguration{}

//Alert configuration variable - Tag Info & Conditions
var Alertconfig tagconfig.AlertSettings = tagconfig.AlertSettings{}

//Alert configuration variable - Alert Info & Conditions, SMTP config, SMS config
var Alertconfigsettings alertconfig.AlertSettings = alertconfig.AlertSettings{}

var logger = log.WithFields(log.Fields{
	"App": config.ConfigurationName,
})

var Client MQTT.Client

var BasePath string = ""
var ProductVersion string = ""

var mqttMessageContent string = ""

var alerts []alertconfig.AlertConfigSettings

var smsConfig sms.SMSConfiguration

var smtpConfig smtp.SMTPConfiguration

var MessageQueueCount = 0

var wg sync.WaitGroup

//AlertManager initialization
//We read all configurations inside init
func init() {

	BasePath = os.Getenv("SPIAI4SUITEINSTALLDIR")
	BasePath = strings.ReplaceAll(BasePath, `\`, `/`)

	ProductVersion = os.Getenv("SPIAI4SUITEVERSION")
	//Setting Log properties
	SetLogProperties()

	logger.Info("Reading AlertManager configurations")
	var readConfigStatus bool = ReadConfigurations()

	if readConfigStatus {

		logger.Info("Reading AlertManager configuration completed")

	} else {

		logger.Error("Reading AlertManager configuration Failed!")

	}

	Client = mqttwrapper.MqttClient(Alertmanagerconfig.MqttBroker, logger)

	//These are commented as we support single configuration message now with alert, smtp & sms configurations
	//New Mqtt topic is used for it spiai4suite/alertmanager/alertsettings
	//mqttwrapper.MqttSubscribe(Client, globalconstants.SMTPSettings, &loadSMTPSettings, logger)
	//mqttwrapper.MqttSubscribe(Client, globalconstants.SMSSettings, &loadSMSSettings, logger)
	//mqttwrapper.MqttSubscribe(Client, globalconstants.AlertSettings, &loadAlertSettings, logger)

	mqttwrapper.MqttSubscribe(Client, globalconstants.AlertConfigSettings, &loadAlertConfigSettings, logger)

	logger.Info("Creating alert database:", globalconstants.AlertDatabase)
	alertoperations.CreateDatabase_query(globalconstants.AlertDatabase, logger)
	logger.Info("Created alert database")
}

//Main Function
func main() {

	ticker := time.NewTicker(1000 * time.Millisecond)

	//Mqtt Publish examples
	//mqttwrapper.MqttPublish(Client, "alert/test1",1,"hello1")
	//mqttwrapper.MqttPublish(Client, "alert/test2",1,"hello2")

	logger.Info("Starting Alert Manager application")
	// time to use our logger, print version, processID and number of running process
	logger.Info("AlertManager v", ProductVersion, " , pid=", os.Getpid(), ", started with processes:", runtime.GOMAXPROCS(runtime.NumCPU()))

	kapacitorConfPath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorConfPath
	kapacitorExePath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorBatchPath
	logger.Info("Base Path:", BasePath)
	logger.Info("KapacitorConfPath:", kapacitorConfPath)
	logger.Info("kapacitorExePath:", kapacitorExePath)
	logger.Info("Running Kapacitor started")
	alertoperations.StartKapacitor(kapacitorExePath, Alertmanagerconfig, logger)
	logger.Info("Running Kapacitor ended")

	logger.Info("Waiting for 5sec to makesure Kapacitor is running before executing Alerts")
	delay.DelaySecond(5)

	if Alertmanagerconfig.LoadConfigOnStart {
		logger.Info("Loading configuration from configuration files")

		logger.Info("Setting SMTP setting in Kapacitor config file started")
		alertoperations.SetSMTPSettings(kapacitorConfPath, Smtpconfig, logger)
		logger.Info("Setting SMTP setting in Kapacitor config file ended")

		logger.Info("Creating new Alerts from configuration started")
		alertoperations.CreateAlerts(kapacitorConfPath, Alertmanagerconfig.TickFilesPath, Alertconfigsettings.AlertConfig, Alertmanagerconfig, Smsconfig, logger)
		logger.Info("Creating new Alerts from configuration ended")

		logger.Info("Waiting for 10sec to makesure all ticks are executed in Kapacitor")
		delay.DelaySecond(10)

		logger.Info("Restarting Kapacitor started")
		alertoperations.RestartKapacitorWithNewConfig(kapacitorExePath, Alertmanagerconfig, logger)
		logger.Info("Restarting Kapacitor ended")
	}

	//The application will run until Control+C is pressed or Application is closed
	for _ = range ticker.C {
		logger.Info("AlertManager running")
		logger.Info("Mqtt Client Connection Status: IsConnected -", Client.IsConnected())
		logger.Info("IsConnectionClosedFlag -", mqttwrapper.IsConnectionClosed)
		logger.Info("IsConnectionOpen -", Client.IsConnectionOpen())
		if mqttwrapper.IsConnectionClosed || !Client.IsConnected() || !Client.IsConnectionOpen() {
			logger.Info("Mqtt Connection lost. Reconnecting..")
			mqttwrapper.MqttClientReconnect(Client, logger)
			logger.Info("Mqtt Client Reconnected")
		}
	}

}

//Mqtt listener for SMTP configuration
//This is not used now
var loadSMTPSettings MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {

	logger.Info("New message received on topic", string(msg.Topic()))
	logger.Info("Message:", string(msg.Payload()))

	message := string(msg.Payload())

	kapacitorConfPath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorConfPath
	kapacitorExePath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorBatchPath

	newSmtpconfig := ParseNewSMTPConfig(message)

	if newSmtpconfig.Host == "" {
		logger.Error("Wrong smtp configuration received")
		return
	}

	Smtpconfig = newSmtpconfig

	logger.Info("Setting SMTP setting in Kapacitor config file started")
	alertoperations.SetSMTPSettings(kapacitorConfPath, Smtpconfig, logger)
	logger.Info("Setting SMTP setting in Kapacitor config file ended")

	logger.Info("Restarting Kapacitor started")
	alertoperations.RestartKapacitorWithNewConfig(kapacitorExePath, Alertmanagerconfig, logger)
	logger.Info("Restarting Kapacitor ended")

}

//Mqtt listener for SMS configuration
//This is not used now
var loadSMSSettings MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {

	logger.Info("New message received on topic", string(msg.Topic()))
	logger.Info("Message:", string(msg.Payload()))

	message := string(msg.Payload())

	newSmsconfig := ParseNewSMSConfig(message)

	if newSmsconfig.Url == "" {
		logger.Error("Wrong sms configuration received")
		return
	}

	Smsconfig = newSmsconfig

	kapacitorConfPath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorConfPath
	kapacitorExePath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorBatchPath

	logger.Info("Creating new Alerts with sms configuration started")
	alertoperations.CreateAlerts(kapacitorConfPath, Alertmanagerconfig.TickFilesPath, Alertconfigsettings.AlertConfig, Alertmanagerconfig, Smsconfig, logger)
	logger.Info("Creating new Alerts with sms configuration ended")

	logger.Info("Restarting Kapacitor started")
	alertoperations.RestartKapacitorWithNewConfig(kapacitorExePath, Alertmanagerconfig, logger)
	logger.Info("Restarting Kapacitor ended")

}

//Mqtt listener for Alert configuration
//This is not used now
var loadAlertSettings MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {

	logger.Info("New message received on topic ", string(msg.Topic()))
	logger.Info("Message: ", string(msg.Payload()))

	message := string(msg.Payload())

	kapacitorConfPath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorConfPath
	kapacitorExePath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorBatchPath

	alerts := ParseNewAlertConfig(message)

	if len(alerts) == 0 {
		logger.Error("Wrong alert configuration received")
		return
	}

	Alertconfig.Alerts = alerts

	logger.Info("Creating new Alerts from configuration started")
	alertoperations.CreateAlerts(kapacitorConfPath, Alertmanagerconfig.TickFilesPath, Alertconfigsettings.AlertConfig, Alertmanagerconfig, Smsconfig, logger)
	logger.Info("Creating new Alerts from configuration ended")

	logger.Info("Restarting Kapacitor started")
	alertoperations.RestartKapacitorWithNewConfig(kapacitorExePath, Alertmanagerconfig, logger)
	logger.Info("Restarting Kapacitor ended")

}

//Mqtt listener for Alert configuration settings
var loadAlertConfigSettings MQTT.MessageHandler = func(client MQTT.Client, msg MQTT.Message) {

	logger.Info("New message received on topic ", string(msg.Topic()))
	logger.Info("Message: ", string(msg.Payload()))

	message := string(msg.Payload())

	mqttMessageContent = message

	MessageQueueCount = MessageQueueCount + 1
	logger.Info("MessageQueueCountWait:", MessageQueueCount)

	go func(mqttMessageContent string, currentCommitCount int) {
		//waiting until the commit executed is finished
		wg.Wait()

		kapacitorConfPath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorConfPath
		kapacitorExePath := BasePath + Alertmanagerconfig.KapacitorPath + globalconstants.KapacitorBatchPath

		alerts = ParseNewAlertConfigSettings(mqttMessageContent)
		smsConfig = ParseNewSMSConfig(mqttMessageContent)
		smtpConfig = ParseNewSMTPConfig(mqttMessageContent)

		if len(alerts) == 0 {
			logger.Warn("Empty alert configuration received!. So will be clearing all existing alerts")
		}

		Alertconfigsettings.AlertConfig = alerts

		wg.Add(1)
		//Checking if its first commit or latest commit
		if currentCommitCount == 1 || currentCommitCount == MessageQueueCount {
			//CurrentCC - Current Commit Count & LastCC - Last Commit Count
			logger.Info("Executing commit. CurrentCC:", currentCommitCount, ", LastCC:", MessageQueueCount)

			//This is checked at each steps to skip current execution if a new message has received
			if MessageQueueCount > currentCommitCount {
				logger.Info("New commit message received.So skipping current smtp settings.CurrentCC:", currentCommitCount, "LastCC:", MessageQueueCount)
				wg.Done()
				return
			} else {
				logger.Info("Setting SMTP setting in Kapacitor config file started")
				alertoperations.SetSMTPSettings(kapacitorConfPath, smtpConfig, logger)
				logger.Info("Setting SMTP setting in Kapacitor config file ended")
			}

			//This is checked at each steps to skip current execution if a new message has received
			if MessageQueueCount > currentCommitCount {
				logger.Info("New commit message received.So skipping current alert config settings.CurrentCC:", currentCommitCount, "LastCC:", MessageQueueCount)
				wg.Done()
				return
			} else {
				//Create Alerts is called even when len(alerts) == 0.This is done to delete all exisiting alerts
				//Delete is done inside CreateAlerts function
				logger.Info("Creating new Alerts from configuration started")
				alertoperations.CreateAlerts(kapacitorConfPath, Alertmanagerconfig.TickFilesPath, Alertconfigsettings.AlertConfig, Alertmanagerconfig, smsConfig, logger)
				logger.Info("Creating new Alerts from configuration ended")
			}

			//This is checked at each steps to skip current execution if a new message has received
			if len(alerts) == 0 {
				logger.Info("No alerts exist! So skipping kapacitor restart.CurrentCC:", currentCommitCount, "LastCC:", MessageQueueCount)
			} else if MessageQueueCount > currentCommitCount {
				logger.Info("New commit message received.So skipping current kapacitor restart.CurrentCC:", currentCommitCount, "LastCC:", MessageQueueCount)
				wg.Done()
				return
			} else {
				logger.Info("Restarting Kapacitor started")
				alertoperations.RestartKapacitorWithNewConfig(kapacitorExePath, Alertmanagerconfig, logger)
				logger.Info("Restarting Kapacitor ended")
			}

			wg.Done()
		} else {
			logger.Info("New message received, so skipping current config!.CurrentCC:", currentCommitCount, "LastCC:", MessageQueueCount)
			logger.Info("Skipping commit. CurrentCC:", currentCommitCount, ", LastCC:", MessageQueueCount)
			wg.Done()
		}
	}(mqttMessageContent, MessageQueueCount)
}

func ParseNewSMTPConfig(message string) smtp.SMTPConfiguration {

	jsonParsed, errSmtp := gabs.ParseJSON([]byte(message))
	if errSmtp != nil {
		logger.Error("Wrong SMTP configuration received: ", errSmtp)
		return smtp.SMTPConfiguration{}
	}

	hostexists := jsonParsed.Exists("smtp", "host")
	logger.Info("HOST DATA EXIST:", hostexists)
	portexists := jsonParsed.Exists("smtp", "port")
	logger.Info("PORT DATA EXIST:", portexists)
	usernameexists := jsonParsed.Exists("smtp", "smtpusername")
	logger.Info("USERNAME DATA EXIST:", usernameexists)
	passwordexists := jsonParsed.Exists("smtp", "password")
	logger.Info("PASSWORD DATA EXIST:", passwordexists)
	fromexists := jsonParsed.Exists("smtp", "from")
	logger.Info("FROM DATA EXIST:", fromexists)

	if !hostexists || !portexists || !usernameexists || !passwordexists || !fromexists {
		return smtp.SMTPConfiguration{}
	}

	newConfig := smtp.SMTPConfiguration{}

	logger.Info("Converted:", jsonParsed.Search("smtp", "host").String())

	newConfig.Host = jsonParsed.Search("smtp", "host").String()
	//We need the port as Integer alone eg:465, All other parameters should be in double quotes
	//eg: "smtp.gmail.com"
	//This is really critical as we set port as "465" then the kapacitor wont start
	//Until an integer value is set for it
	var portString string = strings.ReplaceAll(jsonParsed.Search("smtp", "port").String(), `"`, ``)
	logger.Info("Port1:", portString)
	if val, err := strconv.Atoi(portString); err == nil {
		logger.Info("Port:", val)
		newConfig.Port = portString
	} else {
		logger.Error("Port error:", err)
		newConfig.Port = globalconstants.DefaultSMTPPort
	}

	newConfig.SMTPUserName = jsonParsed.Search("smtp", "smtpusername").String()
	newConfig.Password = jsonParsed.Search("smtp", "password").String()
	newConfig.From = jsonParsed.Search("smtp", "from").String()

	return newConfig
}

func ParseNewSMSConfig(message string) sms.SMSConfiguration {

	jsonParsed, errSms := gabs.ParseJSON([]byte(message))
	if errSms != nil {
		logger.Error("Wrong SMS configuration received: ", errSms)
		return sms.SMSConfiguration{}
	}

	urlexists := jsonParsed.Exists("sms", "url")
	logger.Info("URL DATA EXIST:", urlexists)
	tokenvarexists := jsonParsed.Exists("sms", "tokenvarname")
	logger.Info("TOKEN VAR DATA EXIST:", tokenvarexists)
	tokenexists := jsonParsed.Exists("sms", "token")
	logger.Info("TOKEN DATA EXIST:", tokenexists)
	numbersvarexists := jsonParsed.Exists("sms", "numbersvarname")
	logger.Info("NUMBERS VAR DATA EXIST:", numbersvarexists)
	messagevarexists := jsonParsed.Exists("sms", "messagevarname")
	logger.Info("MESSAGE VAR DATA EXIST:", messagevarexists)
	sendervarexists := jsonParsed.Exists("sms", "sendervarname")
	logger.Info("SENDER VAR DATA EXIST:", sendervarexists)
	senderexists := jsonParsed.Exists("sms", "sender")
	logger.Info("SENDER DATA EXIST:", senderexists)

	if !urlexists || !tokenvarexists || !tokenexists || !numbersvarexists || !messagevarexists || !sendervarexists || !senderexists {
		return sms.SMSConfiguration{}
	}

	newConfig := sms.SMSConfiguration{}

	logger.Info("Converted:", jsonParsed.Search("sms", "url").String())

	newConfig.Url = jsonParsed.Search("sms", "url").String()
	newConfig.TokenVarName = jsonParsed.Search("sms", "tokenvarname").String()
	newConfig.Token = jsonParsed.Search("sms", "token").String()
	newConfig.NumbersVarName = jsonParsed.Search("sms", "numbersvarname").String()
	newConfig.MessageVarName = jsonParsed.Search("sms", "messagevarname").String()
	newConfig.SenderVarName = jsonParsed.Search("sms", "sendervarname").String()
	newConfig.Sender = jsonParsed.Search("sms", "sender").String()

	return newConfig
}

func ParseNewAlertConfig(message string) []tagconfig.AlertTagSettings {

	jsonParsed, errAlertConfig := gabs.ParseJSON([]byte(message))
	if errAlertConfig != nil {
		logger.Error("Wrong Alert configuration received: ", errAlertConfig)
		return make([]tagconfig.AlertTagSettings, 0)
	}
	logger.Info("Checking if minimum values are present started")
	idexists := jsonParsed.Exists("0", "id")
	logger.Info("ID DATA EXIST:", idexists)
	nameexists := jsonParsed.Exists("0", "name")
	logger.Info("NAME DATA EXIST:", nameexists)
	tagidexists := jsonParsed.Exists("0", "tagId")
	logger.Info("TAGID DATA EXIST:", tagidexists)
	functionexists := jsonParsed.Exists("0", "function")
	logger.Info("FUNCTION DATA EXIST:", functionexists)
	alertinfoexists := jsonParsed.Exists("0", "alertinfo")
	logger.Info("ALERTINFO DATA EXIST:", alertinfoexists)
	logger.Info("Checking if minimum values are present ended")
	if !idexists || !nameexists || !tagidexists || !functionexists || !alertinfoexists {
		logger.Error("Minimum values are not present")
		return make([]tagconfig.AlertTagSettings, 0)
	} else {
		logger.Info("Minimum values are present")
	}

	data := jsonParsed.Search().Data().([]interface{})

	newConfig := make([]tagconfig.AlertTagSettings, len(data))

	for k, v := range data {
		conv := v.(map[string]interface{})
		logger.Info("Converted")

		if conv["enabled"] != nil {
			newConfig[k].Enabled = conv["enabled"].(bool)
			logger.Info("Enabled set:", conv["enabled"])
		} else {
			logger.Info("Enabled not set")
		}

		if conv["id"] != nil {
			newConfig[k].Id = conv["id"].(string)
			logger.Info("Id set:", conv["id"])
		} else {
			logger.Info("Id not set")
		}

		if conv["name"] != nil {
			newConfig[k].Name = conv["name"].(string)
			logger.Info("Name set:", conv["name"])
		} else {
			logger.Info("Name not set")
		}

		if conv["tagId"] != nil {
			newConfig[k].TagId = conv["tagId"].(string)
			logger.Info("TagId set:", conv["tagId"])
		} else {
			logger.Info("TagId not set")
		}

		if conv["FQTagName"] != nil {
			newConfig[k].FQTagName = conv["FQTagName"].(string)
			logger.Info("FQTagName set:", conv["FQTagName"])
		} else {
			logger.Info("FQTagName not set")
		}

		if conv["taginfo"] != nil {
			newConfig[k].TagInfo = conv["taginfo"].(string)
			logger.Info("TagInfo set:", conv["taginfo"])
		} else {
			logger.Info("TagInfo not set")
		}

		if conv["groupid"] != nil {
			newConfig[k].GroupId = conv["groupid"].(string)
			logger.Info("GroupId set:", conv["groupid"])
		} else {
			logger.Info("GroupId not set")
		}

		if conv["type"] != nil {
			newConfig[k].Type = conv["type"].(string)
			logger.Info("Type set:", conv["type"])
		} else {
			logger.Info("Type not set")
		}

		if conv["user"] != nil {
			newConfig[k].User = conv["user"].(string)
			logger.Info("User set:", conv["user"])
		} else {
			logger.Info("User not set")
		}

		if conv["deadbandvalue"] != nil {
			if val, err := strconv.ParseFloat(conv["deadbandvalue"].(string), 64); err == nil {
				logger.Info("Deadband value:", val)
				newConfig[k].DeadbandValue = conv["deadbandvalue"].(string)
			}
			logger.Info("DeadbandValue set:", conv["deadbandvalue"])
		} else {
			logger.Info("DeadbandValue not set")
		}

		if conv["activationDelay"] != nil {
			newConfig[k].ActivationDelay = conv["activationDelay"].(string)
			logger.Info("ActivationDelay set:", conv["activationDelay"])
		} else {
			logger.Info("ActivationDelay not set")
		}

		if conv["unit"] != nil {
			newConfig[k].Unit = conv["unit"].(string)
			logger.Info("Unit set:", conv["unit"])
		} else {
			logger.Info("Unit not set")
		}

		if conv["context"] != nil {
			newConfig[k].Context = conv["context"].(string)
			logger.Info("Context set:", conv["context"])
		} else {
			logger.Info("Context not set")
		}

		if conv["function"] != nil {
			newConfig[k].Function = conv["function"].(string)
			logger.Info("Function set:", conv["function"])
		} else {
			logger.Info("Function not set")
		}

		alertinfoconv := conv["alertinfo"].(map[string]interface{})

		if alertinfoconv["id"] != nil {
			newConfig[k].AlertInfo.Id = alertinfoconv["id"].(string)
			logger.Info("AlertInfo.Id set:", alertinfoconv["id"])
		} else {
			logger.Info("AlertInfo.Id not set")
		}

		if alertinfoconv["condition"] != nil {
			newConfig[k].AlertInfo.Condition = alertinfoconv["condition"].(string)
			logger.Info("AlertInfo.Condition set:", alertinfoconv["condition"])
		} else {
			logger.Info("AlertInfo.Condition not set")
		}

		if val, err := strconv.ParseFloat(alertinfoconv["value"].(string), 64); err == nil {
			logger.Info("Condition value:", val)
			newConfig[k].AlertInfo.Value = alertinfoconv["value"].(string)
		}

		if alertinfoconv["interval"] != nil {
			newConfig[k].AlertInfo.Interval = alertinfoconv["interval"].(string)
			logger.Info("AlertInfo.Interval set:", alertinfoconv["interval"])
		} else {
			logger.Info("AlertInfo.Interval not set")
		}

		if alertinfoconv["unit"] != nil {
			newConfig[k].AlertInfo.Unit = alertinfoconv["unit"].(string)
			logger.Info("AlertInfo.Unit set:", alertinfoconv["unit"])
		} else {
			logger.Info("AlertInfo.Unit not set")
		}

		if conv["notifications"] != nil {
			logger.Info("Notification exist")
			notificationsList := conv["notifications"].([]interface{})
			if len(notificationsList) > 0 {
				newConfig[k].Notifications = make([]tagconfig.Notifications, len(notificationsList))
				notification := notificationsList[0].(map[string]interface{})
				logger.Info("Selected alert Notification details:", notification)
				if notification["enabled"] != nil {
					newConfig[k].Notifications[0].Enabled = notification["enabled"].(bool)
					logger.Info("Notifications.Enabled set:", notification["enabled"])
				} else {
					logger.Info("Notifications.Enabled not set")
				}

				if notification["email"] != nil {
					emailinfoconv := notification["email"].(map[string]interface{})
					newConfig[k].Notifications[0].Email.Subject = emailinfoconv["subject"].(string)
					newConfig[k].Notifications[0].Email.Message = emailinfoconv["message"].(string)
					newConfig[k].Notifications[0].Email.To = emailinfoconv["to"].(string)
					logger.Info("Notifications.email set:", emailinfoconv["to"])
				} else {
					logger.Info("Notifications.email not set")
				}
				if notification["sms"] != nil {
					smsinfoconv := notification["sms"].(map[string]interface{})
					newConfig[k].Notifications[0].SMS.Message = smsinfoconv["message"].(string)
					newConfig[k].Notifications[0].SMS.To = smsinfoconv["to"].(string)
					logger.Info("Notifications.sms set:", smsinfoconv["to"])
				} else {
					logger.Info("Notifications.sms not set")
				}

				if notification["recoveryalert"] != nil {
					newConfig[k].Notifications[0].RecoveryAlert = notification["recoveryalert"].(bool)
					logger.Info("Notifications.Recoveryalert set:", notification["recoveryalert"])
				} else {
					logger.Info("Notifications.Recoveryalert not set")
				}
			}
			logger.Info("Notification parsed successfully")
		}
		logger.Info("Converted:", k)
	}

	return newConfig
}

//Parsing new Commit message with alert settings, sms & smtp settings
func ParseNewAlertConfigSettings(message string) []alertconfig.AlertConfigSettings {

	jsonParsed, errAlertConfig := gabs.ParseJSON([]byte(message))
	if errAlertConfig != nil {
		logger.Error("Wrong Alert configuration received: ", errAlertConfig)
		return make([]alertconfig.AlertConfigSettings, 0)
	}

	data := jsonParsed.Search("alertconfig").Data().([]interface{})

	newConfig := make([]alertconfig.AlertConfigSettings, len(data))

	for k, v := range data {
		conv := v.(map[string]interface{})

		logger.Info("Checking if minimum values are present started")
		if conv["id"] == nil || conv["name"] == nil || conv["tagId"] == nil || conv["function"] == nil {
			logger.Error("Minimum values are not present")
			return make([]alertconfig.AlertConfigSettings, 0)
		} else {
			logger.Info("Minimum values are present")
		}

		if conv["enabled"] != nil {
			newConfig[k].Enabled = conv["enabled"].(bool)
			logger.Info("Enabled set:", conv["enabled"])
		} else {
			logger.Info("Enabled not set")
		}

		if conv["id"] != nil {
			newConfig[k].Id = conv["id"].(string)
			logger.Info("Id set:", conv["id"])
		} else {
			logger.Info("Id not set")
		}

		if conv["name"] != nil {
			newConfig[k].Name = conv["name"].(string)
			logger.Info("Name set:", conv["name"])
		} else {
			logger.Info("Name not set")
		}

		if conv["tagId"] != nil {
			newConfig[k].TagId = conv["tagId"].(string)
			logger.Info("TagId set:", conv["tagId"])
		} else {
			logger.Info("TagId not set")
		}

		if conv["FQTagName"] != nil {
			newConfig[k].FQTagName = conv["FQTagName"].(string)
			logger.Info("FQTagName set:", conv["FQTagName"])
		} else {
			logger.Info("FQTagName not set")
		}

		if conv["taginfo"] != nil {
			newConfig[k].TagInfo = conv["taginfo"].(string)
			logger.Info("TagInfo set:", conv["taginfo"])
		} else {
			logger.Info("TagInfo not set")
		}

		if conv["groupid"] != nil {
			newConfig[k].GroupId = conv["groupid"].(string)
			logger.Info("GroupId set:", conv["groupid"])
		} else {
			logger.Info("GroupId not set")
		}

		if conv["type"] != nil {
			newConfig[k].Type = conv["type"].(string)
			logger.Info("Type set:", conv["type"])
		} else {
			logger.Info("Type not set")
		}

		if conv["user"] != nil {
			newConfig[k].User = conv["user"].(string)
			logger.Info("User set:", conv["user"])
		} else {
			logger.Info("User not set")
		}

		if conv["deadbandvalue"] != nil {
			if val, err := strconv.ParseFloat(conv["deadbandvalue"].(string), 64); err == nil {
				logger.Info("Deadband value:", val)
				newConfig[k].DeadbandValue = conv["deadbandvalue"].(string)
			}
			logger.Info("DeadbandValue set:", conv["deadbandvalue"])
		} else {
			logger.Info("DeadbandValue not set")
		}

		if conv["activationDelay"] != nil {
			newConfig[k].ActivationDelay = conv["activationDelay"].(string)
			logger.Info("ActivationDelay set:", conv["activationDelay"])
		} else {
			logger.Info("ActivationDelay not set")
		}

		if conv["unit"] != nil {
			newConfig[k].Unit = conv["unit"].(string)
			logger.Info("Unit set:", conv["unit"])
		} else {
			logger.Info("Unit not set")
		}

		if conv["context"] != nil {
			newConfig[k].Context = conv["context"].(string)
			logger.Info("Context set:", conv["context"])
		} else {
			logger.Info("Context not set")
		}

		if conv["function"] != nil {
			newConfig[k].Function = conv["function"].(string)
			logger.Info("Function set:", conv["function"])
		} else {
			logger.Info("Function not set")
		}

		alertinfoconv := conv["alertinfo"].(map[string]interface{})

		if alertinfoconv["id"] != nil {
			newConfig[k].AlertInfo.Id = alertinfoconv["id"].(string)
			logger.Info("AlertInfo.Id set:", alertinfoconv["id"])
		} else {
			logger.Info("AlertInfo.Id not set")
		}

		if alertinfoconv["condition"] != nil {
			newConfig[k].AlertInfo.Condition = alertinfoconv["condition"].(string)
			logger.Info("AlertInfo.Condition set:", alertinfoconv["condition"])
		} else {
			logger.Info("AlertInfo.Condition not set")
		}

		if val, err := strconv.ParseFloat(alertinfoconv["value"].(string), 64); err == nil {
			logger.Info("Condition value:", val)
			newConfig[k].AlertInfo.Value = alertinfoconv["value"].(string)
		}

		if alertinfoconv["interval"] != nil {
			newConfig[k].AlertInfo.Interval = alertinfoconv["interval"].(string)
			logger.Info("AlertInfo.Interval set:", alertinfoconv["interval"])
		} else {
			logger.Info("AlertInfo.Interval not set")
		}

		if alertinfoconv["unit"] != nil {
			newConfig[k].AlertInfo.Unit = alertinfoconv["unit"].(string)
			logger.Info("AlertInfo.Unit set:", alertinfoconv["unit"])
		} else {
			logger.Info("AlertInfo.Unit not set")
		}

		if conv["notifications"] != nil {
			logger.Info("Notification exist")
			notificationsList := conv["notifications"].([]interface{})
			if len(notificationsList) > 0 {
				newConfig[k].Notifications = make([]alertconfig.Notifications, len(notificationsList))
				notification := notificationsList[0].(map[string]interface{})
				logger.Info("Selected alert Notification details:", notification)
				if notification["enabled"] != nil {
					newConfig[k].Notifications[0].Enabled = notification["enabled"].(bool)
					logger.Info("Notifications.Enabled set:", notification["enabled"])
				} else {
					logger.Info("Notifications.Enabled not set")
				}

				if notification["email"] != nil {
					emailinfoconv := notification["email"].(map[string]interface{})
					newConfig[k].Notifications[0].Email.Subject = emailinfoconv["subject"].(string)
					newConfig[k].Notifications[0].Email.Message = emailinfoconv["message"].(string)
					newConfig[k].Notifications[0].Email.To = emailinfoconv["to"].(string)
					logger.Info("Notifications.email set:", emailinfoconv["to"])
				} else {
					logger.Info("Notifications.email not set")
				}
				if notification["sms"] != nil {
					smsinfoconv := notification["sms"].(map[string]interface{})
					newConfig[k].Notifications[0].SMS.Message = smsinfoconv["message"].(string)
					newConfig[k].Notifications[0].SMS.To = smsinfoconv["to"].(string)
					logger.Info("Notifications.sms set:", smsinfoconv["to"])
				} else {
					logger.Info("Notifications.sms not set")
				}

				if notification["recoveryalert"] != nil {
					newConfig[k].Notifications[0].RecoveryAlert = notification["recoveryalert"].(bool)
					logger.Info("Notifications.Recoveryalert set:", notification["recoveryalert"])
				} else {
					logger.Info("Notifications.Recoveryalert not set")
				}
			}
			logger.Info("Notification parsed successfully")
		}
		logger.Info("Converted:", k)
	}

	return newConfig
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
		MaxSize:    globalconstants.MaxSizeofAlertManagerLogFiles, // megabytes
		MaxBackups: globalconstants.MaxNumberofAlertManagerLogFiles,
	})
}

//Function to read all AlertManager configurations
func ReadConfigurations() bool {
	//Reading AlertManager configuration
	alertManagerConfigError := gonfig.GetConf(globalconstants.ConfigurationPath, &Alertmanagerconfig)
	if alertManagerConfigError != nil {
		logger.Error("Reading AlertManager config failed! ", alertManagerConfigError)
		//fmt.Println(err)
		//os.Exit(500)
		return false
	}

	if Alertmanagerconfig.LoadConfigOnStart {

		//Reading SMTP configuration
		smtpConfigError := gonfig.GetConf(Alertmanagerconfig.SMTPConfigPath, &Smtpconfig)
		if smtpConfigError != nil {
			logger.Error("Reading smtp config failed! ", smtpConfigError)
			//fmt.Println(err1)
			//os.Exit(500)
			return false
		}

		//Reading SMS configuration
		smsConfigError := gonfig.GetConf(Alertmanagerconfig.SMSConfigPath, &Smsconfig)
		if smtpConfigError != nil {
			logger.Error("Reading smtp config failed! ", smsConfigError)
			//fmt.Println(err1)
			//os.Exit(500)
			return false
		}

		//Reading Alert configuration
		alertconfigError := gonfig.GetConf(Alertmanagerconfig.TagConfigPath, &Alertconfig)
		if alertconfigError != nil {
			logger.Error("Reading tag alert config failed! ", alertconfigError)
			//fmt.Println(err3)
			//os.Exit(500)
			return false
		}
		logger.Info("TickFilesPath:", Alertmanagerconfig.TickFilesPath)

		logger.Info("SMTP Configuration:Host-", Smtpconfig.SMTPUserName)
	}

	logger.Info("Version:", Alertmanagerconfig.Version)

	return true
}
