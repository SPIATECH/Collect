//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package alertoperations

import (
	"fmt"
	"io"
	"os"
	exec "os/exec"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"sync"

	"spiatech.com/AlertManager/v1/alertconfig"
	config "spiatech.com/AlertManager/v1/configuration"
	"spiatech.com/AlertManager/v1/delay"
	"spiatech.com/AlertManager/v1/fileoperationswrapper"
	"spiatech.com/AlertManager/v1/globalconstants"
	sms "spiatech.com/AlertManager/v1/smsconfig"
	smtp "spiatech.com/AlertManager/v1/smtpconfig"

	client "github.com/influxdata/influxdb1-client/v2"
	"github.com/nanopack/pulse/kapacitor"
	"github.com/natefinch/lumberjack"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

var KapacitorCmd *exec.Cmd

var Kapacitorlogger = log.New()

var IsKapacitorLogsInitialized = false

var IsKapacitorRestarting = false

var wg sync.WaitGroup

var kapacitorReadStat int

var err error

var kapacitorlogdata []byte

var kapacitorlogbuf []byte

//To create TSDB Database
func CreateDatabase_query(databaseName string, logger *log.Entry) {

	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr:     globalconstants.TSDBAddress,
		Username: globalconstants.TSDBUsername,
		Password: globalconstants.TSDBPassword,
	})

	if err != nil {
		logger.Error("Error creating InfluxDB Client: ", err.Error())
		return
	}

	logger.Info("created InfluxDB Client: ", c)

	defer c.Close()

	var query = globalconstants.CreateDatabaseQuery + databaseName

	logger.Info("Query: ", query)

	q := client.NewQuery(query, databaseName, "")
	if response, err := c.Query(q); err == nil && response.Error() == nil {
		logger.Info(response.Results)
	}

}

//Function to set log properties
func SetKapacitorLogProperties() {

	// Log as JSON instead of the default ASCII formatter.
	//log.SetFormatter(&log.JSONFormatter{})
	Kapacitorlogger.SetFormatter(&log.JSONFormatter{})

	// Output to stdout instead of the default stderr
	// Can be any io.Writer, see below for File example
	Kapacitorlogger.SetOutput(os.Stdout)

	// Only log the warning severity or above.
	Kapacitorlogger.SetLevel(log.InfoLevel)

	Kapacitorlogger.SetOutput(&lumberjack.Logger{
		Filename:   globalconstants.KapacitorLogPath,
		MaxSize:    globalconstants.MaxSizeofKapacitorLogFiles, // megabytes
		MaxBackups: globalconstants.MaxNumberofKapacitorLogFiles,
	})
}

//Function to start Kapacitor
func StartKapacitor(path string, Alertmanagerconfig config.Configuration, logger *log.Entry) {

	IsKapacitorRestarting = false

	logger.Info("IsKapacitorLogEnabled: ", Alertmanagerconfig.IsKapacitorLogEnabled)

	if Alertmanagerconfig.IsKapacitorLogEnabled {
		if !IsKapacitorLogsInitialized {
			logger.Info("Initializing Kapacitor log properties")
			//Setting Log properties
			SetKapacitorLogProperties()
			IsKapacitorLogsInitialized = true
		} else {
			logger.Info("Kapacitor log properties already initialized")
		}
	}

	path, err := exec.LookPath(path)
	if err != nil {
		logger.Error("Kapacitor not found")
		return
	}
	logger.Info("Kapacitor is available at ", path)

	KapacitorCmd = exec.Command(path)

	var stdoutIn io.ReadCloser
	var stderrIn io.ReadCloser

	if Alertmanagerconfig.IsKapacitorLogEnabled {
		stdoutIn, _ = KapacitorCmd.StdoutPipe()
		stderrIn, _ = KapacitorCmd.StderrPipe()
	}

	// open the out file for writing
	logger.Info("Creating Kapacitor log file if not exist")
	fileoperationswrapper.CreateFile(globalconstants.KapacitorLogPath)

	kapacitorRunerr := KapacitorCmd.Start()
	if kapacitorRunerr != nil {
		logger.Error("Running Kapacitor failed with ", kapacitorRunerr)
		return
	} else {
		logger.Info("Kapacitor Started successfully")
	}

	if Alertmanagerconfig.IsKapacitorLogEnabled {
		go func() {
			// cmd.Wait() should be called only after we finish reading
			// from stdoutIn and stderrIn.
			// wg ensures that we finish
			logger.Trace("Collecting Kapacitor logs and writing to file")

			wg.Add(1)
			go func() {
				copyAndCapture(os.Stdout, stdoutIn, logger)
				wg.Done()
			}()
			wg.Add(1)
			go func() {
				copyAndCapture(os.Stderr, stderrIn, logger)
				wg.Done()
			}()
			wg.Wait()
			logger.Trace("Waiting to write Kapacitor logs to file started")
			err = KapacitorCmd.Wait()
			if err != nil {
				logger.Error("Writing Kapacitor logs failed :", err)
				return
			}
			logger.Trace("Waiting to write Kapacitor logs to file ended")
		}()
	}
}

func copyAndCapture(w io.Writer, r io.Reader, logger *log.Entry) {

	kapacitorlogbuf = make([]byte, 1024, 1024)
	for {
		logger.Trace("Writing Kapacitor Logs")
		//This is done to stop all currently running go routines when Kapacitor is restarted
		//On Restart new go routines will be initiated
		if IsKapacitorRestarting {
			logger.Info("Kapacitor restarting so stop writing kapacitor logs!")
			return
		}
		kapacitorReadStat, err = r.Read(kapacitorlogbuf[:])
		if kapacitorReadStat > 0 {
			kapacitorlogdata = kapacitorlogbuf[:kapacitorReadStat]
			Kapacitorlogger.Info(string(kapacitorlogdata))
		}
		if err != nil {
			// Read returns io.EOF at the end of file, which is not an error for us
			if err == io.EOF {
				logger.Trace("End of Kapacitor logs reached")
				err = nil
				break
			} else {
				logger.Error("Kapacitor logs writing error:", err)
				break
			}
		}
	}
}

//Function to Restart Kapacitor
//Kapacitor will load new config when running again
func RestartKapacitorWithNewConfig(path string, Alertmanagerconfig config.Configuration, logger *log.Entry) {

	IsKapacitorRestarting = true
	logger.Info("Stopping currently running Kapacitor instance")

	error := kill(KapacitorCmd, logger)

	logger.Info("Kapacitor stopped", error)
	//Waiting few seconds to makesure the Kapacitor is stopped before starting it again
	delay.DelaySecond(globalconstants.TimeDelayBeforeRestartInSec)

	logger.Info("Starting Kapacitor started")
	StartKapacitor(path, Alertmanagerconfig, logger)
	logger.Info("Starting Kapacitor ended")
}

//Function to kill currently running application using its process id
func kill(cmd *exec.Cmd, logger *log.Entry) error {

	osType := runtime.GOOS

	fmt.Println("OS Detected: ", osType)
	logger.Info("OS Detected: ", osType)
	if osType == "windows" {
		logger.Info("Executing windows task killing for kapacitor:", cmd.Process.Pid)
		kill := exec.Command("TASKKILL", "/F", "/IM", "kapacitord.exe", "/T")
		kill.Stderr = os.Stderr
		kill.Stdout = os.Stdout
		return kill.Run()
	}

	logger.Info("Executing normal task kill for kapacitor")
	return cmd.Process.Kill()

}

//Function to update SMTP settings in Kapacitor configuration file
func SetSMTPSettings(path string, smtpconfiguration smtp.SMTPConfiguration, logger *log.Entry) {

	logger.Info("Setting SMTP settings in Kapacitor started")

	logger.Info("Reading current Kapacitor configuration")
	var configContent string = fileoperationswrapper.ReadFile(path)

	r := regexp.MustCompile(globalconstants.RegularExpressionForSMTP)
	var newConfigContent string = globalconstants.SMTPConfigContent
	var portAsNumber string = strings.ReplaceAll(smtpconfiguration.Port, `"`, ``)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$HOST$", smtpconfiguration.Host)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$PORT$", portAsNumber)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$USERNAME$", smtpconfiguration.SMTPUserName)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$PASSWORD$", smtpconfiguration.Password)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$FROM$", smtpconfiguration.From)
	configContent = r.ReplaceAllString(configContent, newConfigContent)

	logger.Info("Updated Kapacitor Configuration:", configContent)

	//Writing updated configuration to kapacitor.conf
	fileoperationswrapper.WriteFile(path, configContent, true)
	logger.Info("Kapacitor configuration updated with new SMTP configuration.Updated file contents :", newConfigContent)

	logger.Info("Setting SMTP settings in Kapacitor ended")

}

//Function to update SMS settings in Kapacitor configuration file
func SetSMSSettings(path string, endPointName string, url string, smsPostContent string, logger *log.Entry) {

	logger.Info("Setting SMS settings in Kapacitor started")

	logger.Info("Reading current Kapacitor configuration")
	var configContent string = fileoperationswrapper.ReadFile(path)

	var newConfigContent string = globalconstants.SMSConfigContent
	newConfigContent = strings.ReplaceAll(newConfigContent, "$ENDPOINT$", endPointName)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$URL$", url)
	newConfigContent = strings.ReplaceAll(newConfigContent, "$ALERTTEMPLATE$", smsPostContent)
	configContent = configContent + newConfigContent
	//Writing updated configuration to kapacitor.conf
	fileoperationswrapper.WriteFile(path, configContent, true)
	logger.Info("Kapacitor configuration updated with new SMS configuration.Updated file contents :", newConfigContent)

	logger.Info("Setting SMS settings in Kapacitor ended")

}

func CreateAlerts(kapacitorPath string, tickPath string, alert []alertconfig.AlertConfigSettings, alertmanagerconfig config.Configuration, smsconfig sms.SMSConfiguration, logger *log.Entry) {

	logger.Info("Creating Tick Files started")
	logger.Info("Tick path:", tickPath)

	//Creating Tick Directories if not exist
	fileoperationswrapper.CreateDirIfNotExist(tickPath)

	logger.Info("Deleting all existing tasks started")
	DeleteAlertsInKapacitor(alertmanagerconfig.KapacitorAddress, logger)
	logger.Info("Deleting all existing tasks ended")

	logger.Info("Reading current Kapacitor configuration")
	var configContent string = fileoperationswrapper.ReadFile(kapacitorPath)

	r := regexp.MustCompile(`(?s)#ALERTMANAGER SMS SETTINGS(.*)`)
	configContent = r.ReplaceAllString(configContent, `#ALERTMANAGER SMS SETTINGS`)
	logger.Info("regexp:", configContent)
	//Writing updated configuration to kapacitor.conf
	var stat = fileoperationswrapper.WriteFile(kapacitorPath, configContent, true)

	if !stat {
		logger.Info("Clearing previous sms config failed!")
	}

	var count int = 0
	var smsFilepath string = ""
	var baseFilepath string = ""
	var emailFilepath string = ""
	var messageContent string = ""

	//Creating alerts
	for count < len(alert) {
		fmt.Println(alert[count].Name, "Enabled:", alert[count].Enabled)
		logger.Info(alert[count].Name, "Enabled states:", alert[count].Enabled)

		if alert[count].Enabled {
			logger.Info("Alert is Enabled")
			var id string = alert[count].TagId + "_" + alert[count].Id + "_" + alert[count].Name

			baseFilepath = tickPath + "/" + id + "_base" + ".tick"
			emailFilepath = tickPath + "/" + id + "_email" + ".tick"
			smsFilepath = tickPath + "/" + id + "_sms" + ".tick"

			logger.Info("BaseTickFile:", baseFilepath)
			logger.Info("EmailTickFile:", emailFilepath)
			logger.Info("SMSTickFile:", smsFilepath)

			logger.Info("Deleting tick file if already exist")
			fileoperationswrapper.DeleteFile(baseFilepath)
			fileoperationswrapper.DeleteFile(emailFilepath)
			fileoperationswrapper.DeleteFile(smsFilepath)

			logger.Info("Creating new tick file")

			var baseFileCreateStatus = fileoperationswrapper.CreateFile(baseFilepath)
			if baseFileCreateStatus {
				logger.Info("Base Tick file created successfully")
			} else {
				logger.Error("Base Tick file creation failed!")
			}

			var notification alertconfig.Notifications

			if len(alert[count].Notifications) > 0 {
				logger.Info("Notification exist for the alert")
				notification = alert[count].Notifications[0]
			}

			if notification.Email.To != "" && notification.Enabled {
				logger.Info("Email exist for the alert")
				var emailFileCreateStatus = fileoperationswrapper.CreateFile(emailFilepath)
				if emailFileCreateStatus {
					logger.Info("Email Tick file created successfully")
				} else {
					logger.Error("Email Tick file creation failed!")
				}
			} else {
				logger.Info("Email does not exist for the alert or is disabled")
			}

			if notification.SMS.To != "" && notification.Enabled {
				logger.Info("SMS exist for the alert")
				var smsFileCreateStatus = fileoperationswrapper.CreateFile(smsFilepath)
				if smsFileCreateStatus {
					logger.Info("SMS Tick file created successfully")
				} else {
					logger.Error("SMS Tick file creation failed!")
				}
			} else {
				logger.Info("SMS does not exist for the alert or is disabled")
			}

			var tickContent = ``
			var period = globalconstants.DefaultPeriod

			if alert[count].Function != globalconstants.Lastfunction {
				period = alert[count].AlertInfo.Interval + alert[count].AlertInfo.Unit
				logger.Info("New Period: ", period)
			}

			if alert[count].Function == globalconstants.Differencefunction {
				logger.Info("Difference Function tick script used")
				tickContent = globalconstants.DifferenceTickContent
				messageContent = globalconstants.TickDifferenceMessageContent
			} else {
				logger.Info("Common tick script used")
				tickContent = globalconstants.TickContent
				messageContent = globalconstants.TickMessageContent
			}

			tickContent = strings.ReplaceAll(tickContent, "$TAGIDREPLACE$", alert[count].TagId)

			tickContent = strings.ReplaceAll(tickContent, "$PERIODREPLACE$", period)

			tickContent = strings.ReplaceAll(tickContent, "$INTERVALREPLACE$", alertmanagerconfig.IntervalPeriod)

			var baseTickContent string = ""
			var emailTickContent string = ""
			var smsTickContent string = ""

			//Function
			var functioncondition string = ""
			var infocondition string = ""
			var deadbandcondition string = ""
			var condition string = ""

			var functionContent string = ""
			var infoConditionContent string = ""
			var influxdbOutContent string = ""
			var activationdelayContent string = ""

			FunctionTickChanges(alert[count], &messageContent, &activationdelayContent, &functioncondition, &functionContent, &infocondition, &infoConditionContent, logger)

			tickContent = strings.ReplaceAll(tickContent, "$FUNCTION$", functionContent)
			//The order is important as we make the InfoCondition first and then add it in tickcontent
			condition = strings.ReplaceAll(globalconstants.TickInfoCondition, "$INFOCONDITION$", infoConditionContent)
			tickContent = strings.ReplaceAll(tickContent, "$CONDITIONREPLACE$", condition)
			tickContent = strings.ReplaceAll(tickContent, "$ACTIVATIONDELAY$", activationdelayContent)

			//Deadband
			if alert[count].DeadbandValue != "" {
				logger.Info("Deadband set for Tag:", alert[count].TagInfo)
				deadbandcondition = globalconstants.TickDeadbandCondition
				deadbandcondition = strings.ReplaceAll(deadbandcondition, "$CONDITION$", globalconstants.DeadbandCondition[alert[count].AlertInfo.Condition])

				var checkValue float64
				var deadbandValue float64
				var checkValueErr error
				var deadbandValueErr error
				var deadbandResultValue float64

				if checkValue, checkValueErr = strconv.ParseFloat(alert[count].AlertInfo.Value, 64); checkValueErr == nil {
					logger.Info("CheckValue :", checkValue)
				}
				logger.Info("CheckValue :", checkValue)
				if deadbandValue, deadbandValueErr = strconv.ParseFloat(alert[count].DeadbandValue, 64); deadbandValueErr == nil {
					logger.Info("DeadbandValue :", deadbandValue)
				}

				if checkValueErr == nil && deadbandValueErr == nil {
					logger.Info("Calculating Deadband value")
					if alert[count].AlertInfo.Condition == globalconstants.GreaterThan || alert[count].AlertInfo.Condition == globalconstants.GreaterThanOrEqual {
						deadbandResultValue = checkValue - deadbandValue
						logger.Info("Subtracting Deadband from Condition value, Result:", float64(deadbandResultValue))
						deadbandcondition = strings.ReplaceAll(deadbandcondition, "$VALUE$", fmt.Sprintf("%f", deadbandResultValue))
					} else if alert[count].AlertInfo.Condition == globalconstants.LessThan || alert[count].AlertInfo.Condition == globalconstants.LessThanOrEqual {
						deadbandResultValue = checkValue + deadbandValue
						logger.Info("Adding Deadband with Condition value, Result:", deadbandResultValue)
						deadbandcondition = strings.ReplaceAll(deadbandcondition, "$VALUE$", fmt.Sprintf("%f", deadbandResultValue))
					}
				} else {
					logger.Error("Wrong Check Value or Deadband Value, Parsing to float failed!")
				}

				if alert[count].Function == globalconstants.Lastfunction {
					logger.Info("Checking Last value for Deadband")
					deadbandcondition = strings.ReplaceAll(deadbandcondition, "$TYPE$", `"value"`)
				} else {
					logger.Info("Checking Function value for Deadband")
					deadbandcondition = strings.ReplaceAll(deadbandcondition, "$TYPE$", globalconstants.TickFunctionTypeValInQuotes)
				}

			}
			tickContent = strings.ReplaceAll(tickContent, "$DEADBAND$", deadbandcondition)

			//Email
			var emailSubjectContent string = ""
			var emailBodyContent string = ""
			var emailDetailsMessageContent string = ""
			var emailContent string = ""
			var emailMessageContent = ""
			var smsEndpointContent string = ""
			var smsPostContent string = ""
			var smsMessageContent string = ""
			var mqttContent string = ""

			if len(alert[count].Notifications) > 0 && notification.Email.To != "" && notification.Enabled {

				logger.Info("Setting Email configuration for Tag:", alert[count].TagInfo)

				emailMessageContent = notification.Email.Subject

				emailDetailsMessageContent = globalconstants.TickEmailMessageContent

				emailSubjectContent = notification.Email.Subject
				emailBodyContent = notification.Email.Message

				emailSubjectContent = ChangeContentToAlertFormat(alert[count], emailSubjectContent, "")
				emailBodyContent = ChangeContentToAlertFormat(alert[count], emailBodyContent, globalconstants.EmailMessageType)

				emailDetailsMessageContent = strings.ReplaceAll(emailDetailsMessageContent, "$SUBJECT$", emailSubjectContent)
				emailDetailsMessageContent = strings.ReplaceAll(emailDetailsMessageContent, "$MESSAGE$", emailBodyContent)

				emailContent = globalconstants.TickEmailContent

				emailidList := strings.Split(notification.Email.To, ",")

				var emailIdCount int = 0

				for emailIdCount < len(emailidList) {

					emailid := strings.ReplaceAll(globalconstants.TickEmailToContent, "$EMAILID$", emailidList[emailIdCount])
					emailContent = emailContent + emailid
					emailIdCount++

				}

			}

			logger.Info("Email configuration:", emailContent)
			emailTickContent = strings.ReplaceAll(tickContent, "$EMAILMESSAGECONTENT$", emailDetailsMessageContent)
			emailTickContent = strings.ReplaceAll(emailTickContent, "$ACTIONREPLACE$", emailContent)
			logger.Info("Email configuration added to tick successfully")

			//SMS
			if len(alert[count].Notifications) > 0 && notification.SMS.To != "" && notification.Enabled {

				logger.Info("Setting SMS configuration for Tag:", alert[count].TagInfo)

				smsMessageContent = notification.SMS.Message

				smsEndpointContent = globalconstants.TickSMSEndPointContent
				smsEndpointContent = strings.ReplaceAll(smsEndpointContent, "$ENDPOINT$", id)

				smsPostContent = globalconstants.KapacitorSMSPostContent
				smsPostContent = strings.ReplaceAll(smsPostContent, "$TOKENVARNAME$", smsconfig.TokenVarName)
				smsPostContent = strings.ReplaceAll(smsPostContent, "$SMSTOKEN$", smsconfig.Token)
				smsPostContent = strings.ReplaceAll(smsPostContent, "$NUMBERSVARNAME$", smsconfig.NumbersVarName)
				smsPostContent = strings.ReplaceAll(smsPostContent, "$PHONENUMBERS$", notification.SMS.To)
				smsPostContent = strings.ReplaceAll(smsPostContent, "$MESSAGEVARNAME$", smsconfig.MessageVarName)
				smsPostContent = strings.ReplaceAll(smsPostContent, "$SENDERVARNAME$", smsconfig.SenderVarName)
				smsPostContent = strings.ReplaceAll(smsPostContent, "$SENDER$", smsconfig.Sender)

				smsPostContent = strings.ReplaceAll(smsPostContent, `"`, "")

				SetSMSSettings(kapacitorPath, id, smsconfig.Url, smsPostContent, logger)
			}

			logger.Info("SMS Tick Content:", smsEndpointContent)
			logger.Info("SMS Kapacitor Post Content:", smsPostContent)
			smsTickContent = strings.ReplaceAll(tickContent, "$ACTIONREPLACE$", smsEndpointContent)
			logger.Info("SMS configuration added to tick successfully")

			messageContent = ChangeContentToAlertFormat(alert[count], messageContent, "")
			emailMessageContent = ChangeContentToAlertFormat(alert[count], emailMessageContent, globalconstants.EmailMessageType)
			smsMessageContent = ChangeContentToAlertFormat(alert[count], smsMessageContent, "")

			baseTickContent = strings.ReplaceAll(tickContent, "$MESSAGEREPLACE$", messageContent)
			emailTickContent = strings.ReplaceAll(emailTickContent, "$MESSAGEREPLACE$", emailMessageContent)
			smsTickContent = strings.ReplaceAll(smsTickContent, "$MESSAGEREPLACE$", smsMessageContent)

			mqttContent = strings.ReplaceAll(globalconstants.MqttTickContent, "$TAGIDREPLACE$", alert[count].TagId)
			baseTickContent = strings.ReplaceAll(baseTickContent, "$MQTT$", mqttContent)

			//To write alerts to Influxdb
			if alertmanagerconfig.InfluxdbOut {

				logger.Info("Tick changes to write alerts to Influxdb")
				influxdbOutContent = globalconstants.InfluxdbOutCondition
				influxdbOutContent = strings.ReplaceAll(influxdbOutContent, "$DATABASE$", globalconstants.AlertDatabase)
				influxdbOutContent = strings.ReplaceAll(influxdbOutContent, "$MEASUREMENT$", globalconstants.AlertMeasurement)
				influxdbOutContent = strings.ReplaceAll(influxdbOutContent, "$TAGINFO$", alert[count].TagInfo)
				influxdbOutContent = strings.ReplaceAll(influxdbOutContent, "$ALERTNAME$", alert[count].Name)
			}

			if !notification.RecoveryAlert {
				logger.Info("Ok message not needed for the alert")
				emailTickContent = strings.ReplaceAll(emailTickContent, "$IGNOREOKMESSAGE$", globalconstants.IgnoreOkMessageTickContent)
				smsTickContent = strings.ReplaceAll(smsTickContent, "$IGNOREOKMESSAGE$", globalconstants.IgnoreOkMessageTickContent)
			} else {
				logger.Info("Ok message needed for the alert")
				emailTickContent = strings.ReplaceAll(emailTickContent, "$IGNOREOKMESSAGE$", "")
				smsTickContent = strings.ReplaceAll(smsTickContent, "$IGNOREOKMESSAGE$", "")
			}

			if notification.Email.To != "" && notification.Enabled {
				emailTickContent = strings.ReplaceAll(emailTickContent, "$INFLUXDBOUT$", "")
				emailTickContent = strings.ReplaceAll(emailTickContent, "$MQTT$", "")
				//Writing DB and measurement selection
				fileoperationswrapper.WriteFile(emailFilepath, emailTickContent, false)
			} else {
				logger.Info("Email Notification is disabled or no recipients.Skipping email alert")
				emailTickContent = ""
			}

			if notification.SMS.To != "" && notification.Enabled {
				smsTickContent = strings.ReplaceAll(smsTickContent, "$EMAILMESSAGECONTENT$", "")
				smsTickContent = strings.ReplaceAll(smsTickContent, "$INFLUXDBOUT$", "")
				smsTickContent = strings.ReplaceAll(smsTickContent, "$MQTT$", "")
				//Writing DB and measurement selection
				fileoperationswrapper.WriteFile(smsFilepath, smsTickContent, false)
			} else {
				logger.Info("SMS Notification is disabled or no recipients.Skipping sms alert")
				smsTickContent = ""
			}

			baseTickContent = strings.ReplaceAll(baseTickContent, "$IGNOREOKMESSAGE$", "")
			baseTickContent = strings.ReplaceAll(baseTickContent, "$INFLUXDBOUT$", influxdbOutContent)
			baseTickContent = strings.ReplaceAll(baseTickContent, "$EMAILMESSAGECONTENT$", "")
			baseTickContent = strings.ReplaceAll(baseTickContent, "$ACTIONREPLACE$", "")
			//Writing DB and measurement selection
			fileoperationswrapper.WriteFile(baseFilepath, baseTickContent, false)

			logger.Info("Basic TickContent written to tick file successfully")
			RunAlertInKapacitor(baseTickContent, emailTickContent, smsTickContent, id, globalconstants.CollectDatabase, globalconstants.CollectRetentionPolicy, alertmanagerconfig.KapacitorAddress, logger)
		} else {
			logger.Info("Alert is disabled")
		}
		count++
	}

	logger.Info("Tick Files created successfully")
}

func FunctionTickChanges(alert alertconfig.AlertConfigSettings, messageContent *string, activationdelayContent *string, functioncondition *string, functionContent *string, infocondition *string, infoConditionContent *string, logger *log.Entry) {

	logger.Info(alert.Function, "Function set for Tag:", alert.TagInfo)

	switch alert.Function {

	case globalconstants.Lastfunction:

		*messageContent = strings.ReplaceAll(*messageContent, "$VALUE$", "value")

		*functionContent = globalconstants.LastFunctionTickContent

		if alert.ActivationDelay != "" {
			logger.Info("ActivationDelay is set: ", alert.ActivationDelay)
			*activationdelayContent = globalconstants.ActivationDelayTickContent
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$TYPE$", `"value"`)
			if alert.AlertInfo.Condition == "=" {
				*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$CONDITION$", "==")
			} else {
				*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$CONDITION$", alert.AlertInfo.Condition)
			}
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$VALUE$", alert.AlertInfo.Value)
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$UNIT$", alert.Unit)

			*infocondition = globalconstants.ActivationDelayInfoTickContent
			*infocondition = strings.ReplaceAll(*infocondition, "$TIME$", alert.ActivationDelay)

		} else {
			logger.Info("ActivationDelay is not set")
			*activationdelayContent = ""
			*infocondition = globalconstants.LastFunctionTickCondition
			if alert.AlertInfo.Condition == "=" {
				*infocondition = strings.ReplaceAll(*infocondition, "$CONDITION$", "==")
			} else {
				*infocondition = strings.ReplaceAll(*infocondition, "$CONDITION$", alert.AlertInfo.Condition)
			}

			*infocondition = strings.ReplaceAll(*infocondition, "$VALUE$", alert.AlertInfo.Value)
		}

		*infoConditionContent = *infocondition

	case globalconstants.Meanfunction, globalconstants.Medianfunction, globalconstants.Maxfunction, globalconstants.Minfunction,
		globalconstants.Sumfunction:

		*messageContent = strings.ReplaceAll(*messageContent, "$VALUE$", globalconstants.TickFunctionTypeVal)

		*functionContent = globalconstants.CommonFunctionTickContent
		*functionContent = strings.ReplaceAll(*functionContent, "$FUNCTION$", strings.ToLower(alert.Function))

		if alert.ActivationDelay != "" {
			logger.Info("ActivationDelay is set: ", alert.ActivationDelay)
			*activationdelayContent = globalconstants.ActivationDelayTickContent
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$TYPE$", globalconstants.TickFunctionTypeValInQuotes)
			if alert.AlertInfo.Condition == "=" {
				*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$CONDITION$", "==")
			} else {
				*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$CONDITION$", alert.AlertInfo.Condition)
			}
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$VALUE$", alert.AlertInfo.Value)
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$UNIT$", alert.Unit)

			*infocondition = globalconstants.ActivationDelayInfoTickContent
			*infocondition = strings.ReplaceAll(*infocondition, "$TIME$", alert.ActivationDelay)

		} else {
			logger.Info("ActivationDelay is not set")
			*activationdelayContent = ""

			*infocondition = globalconstants.CommonFunctionTickCondition
			if alert.AlertInfo.Condition == "=" {
				*infocondition = strings.ReplaceAll(*infocondition, "$CONDITION$", "==")
			} else {
				*infocondition = strings.ReplaceAll(*infocondition, "$CONDITION$", alert.AlertInfo.Condition)
			}

			*infocondition = strings.ReplaceAll(*infocondition, "$VALUE$", alert.AlertInfo.Value)
		}
		*infoConditionContent = *infocondition

	case globalconstants.Differencefunction:

		logger.Info("Function content already added in Difference function script")
		*functionContent = ""
		if alert.ActivationDelay != "" {
			logger.Info("ActivationDelay is set: ", alert.ActivationDelay)
			*activationdelayContent = globalconstants.ActivationDelayTickContent
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$TYPE$", globalconstants.TickFunctionTypeValInQuotes)
			if alert.AlertInfo.Condition == "=" {
				*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$CONDITION$", "==")
			} else {
				*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$CONDITION$", alert.AlertInfo.Condition)
			}
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$VALUE$", alert.AlertInfo.Value)
			*activationdelayContent = strings.ReplaceAll(*activationdelayContent, "$UNIT$", alert.Unit)

			*infocondition = globalconstants.ActivationDelayInfoTickContent
			*infocondition = strings.ReplaceAll(*infocondition, "$TIME$", alert.ActivationDelay)

		} else {
			logger.Info("ActivationDelay is not set")
			*activationdelayContent = ""
			*infocondition = globalconstants.CommonFunctionTickCondition
			if alert.AlertInfo.Condition == "=" {
				*infocondition = strings.ReplaceAll(*infocondition, "$CONDITION$", "==")
			} else {
				*infocondition = strings.ReplaceAll(*infocondition, "$CONDITION$", alert.AlertInfo.Condition)
			}

			*infocondition = strings.ReplaceAll(*infocondition, "$VALUE$", alert.AlertInfo.Value)
		}
		*infoConditionContent = *infocondition
	default:
		logger.Error("Given Function does not match")
		return
	}
}

//Function to change arguments in messages to Kapacitor Alert format
func ChangeContentToAlertFormat(alert alertconfig.AlertConfigSettings, message string, messageType string) string {

	var messageContent = strings.ReplaceAll(message, "{timestamp}", globalconstants.MessageTimeFormat)
	messageContent = strings.ReplaceAll(messageContent, "{tagname}", alert.FQTagName)
	messageContent = strings.ReplaceAll(messageContent, "{taginfo}", alert.TagInfo)
	messageContent = strings.ReplaceAll(messageContent, "{alertname}", alert.Name)
	messageContent = strings.ReplaceAll(messageContent, "{context}", alert.Context)
	messageContent = strings.ReplaceAll(messageContent, "{function}", alert.Function)
	if alert.Function != globalconstants.Lastfunction {
		messageContent = strings.ReplaceAll(messageContent, "{value}", globalconstants.MessageFuncValueFormat)
	} else {
		messageContent = strings.ReplaceAll(messageContent, "{value}", globalconstants.MessageValueFormat)
	}
	if messageType == globalconstants.EmailMessageType {
		//This is done to make the messages come in multiple lines if present
		//because <br> is used in HTML for new line instead of \n
		messageContent = strings.ReplaceAll(messageContent, "\n", "<br>")
		fmt.Println("New br message content:", messageContent)
	}
	return messageContent
}

//To run tickContent in Kapacitor and enable it
func RunAlertInKapacitor(baseTickContent string, emailTickContent string, smsTickContent string, taskId string, db string, rp string, KapacitorAddress string, logger *log.Entry) {

	logger.Info("Kapacitor Initialization started")

	viper.SetDefault("kapacitor-address", KapacitorAddress)
	kapacitorInitErr := kapacitor.Init()
	if kapacitorInitErr != nil {
		logger.Error("Kapacitor Initialization failed!", kapacitorInitErr)
		return
	}
	logger.Info("Kapacitor Initialization ended")

	if baseTickContent != "" {

		var baseTaskId = taskId + "_base"

		logger.Info("Deleting existing alert with ", baseTaskId, " if already exist")
		deleteAlertErr := kapacitor.DeleteTask(baseTaskId)
		if deleteAlertErr != nil {
			logger.Error("Deleting Alert ", baseTaskId, "Failed or No alert exist with this Id.", deleteAlertErr)
		}

		logger.Info("Executing Alert in Kapacitor started")
		task := kapacitor.Task{
			Id:              baseTaskId,
			Type:            "batch",
			Database:        db,
			RetentionPolicy: rp,
			Script:          baseTickContent,
			Status:          "enabled",
		}
		ExecuteAlertErr := kapacitor.SetTask(task)
		if ExecuteAlertErr != nil {
			logger.Error("Executing Alert with Id-", baseTaskId, " Failed!", ExecuteAlertErr)
		}
	}

	if emailTickContent != "" {

		var emailTaskId = taskId + "_email"

		logger.Info("Deleting existing alert with ", emailTaskId, " if already exist")
		deleteAlertErr := kapacitor.DeleteTask(emailTaskId)
		if deleteAlertErr != nil {
			logger.Error("Deleting Alert ", emailTaskId, "Failed or No alert exist with this Id.", deleteAlertErr)
		}

		logger.Info("Executing Alert in Kapacitor started")
		task := kapacitor.Task{
			Id:              emailTaskId,
			Type:            "batch",
			Database:        db,
			RetentionPolicy: rp,
			Script:          emailTickContent,
			Status:          "enabled",
		}
		ExecuteAlertErr := kapacitor.SetTask(task)
		if ExecuteAlertErr != nil {
			logger.Error("Executing Alert with Id-", emailTaskId, " Failed!", ExecuteAlertErr)
		}
	}

	if smsTickContent != "" {

		var smsTaskId = taskId + "_sms"
		logger.Info("Deleting existing alert with ", smsTaskId, " if already exist")
		deleteAlertErr := kapacitor.DeleteTask(smsTaskId)
		if deleteAlertErr != nil {
			logger.Error("Deleting Alert ", smsTaskId, "Failed or No alert exist with this Id.", deleteAlertErr)
		}

		logger.Info("Executing Alert in Kapacitor started")
		task := kapacitor.Task{
			Id:              smsTaskId,
			Type:            "batch",
			Database:        db,
			RetentionPolicy: rp,
			Script:          smsTickContent,
			Status:          "enabled",
		}
		ExecuteAlertErr := kapacitor.SetTask(task)
		if ExecuteAlertErr != nil {
			logger.Error("Executing Alert with Id-", smsTaskId, " Failed!", ExecuteAlertErr)
		}
	}
	logger.Info("Executing Alert in Kapacitor ended")
}

//To run tickContent in Kapacitor and enable it
func DeleteAlertsInKapacitor(KapacitorAddress string, logger *log.Entry) {

	logger.Info("Kapacitor Initialization started")

	viper.SetDefault("kapacitor-address", KapacitorAddress)
	kapacitorInitErr := kapacitor.Init()
	if kapacitorInitErr != nil {
		logger.Error("Kapacitor Initialization failed!", kapacitorInitErr)
		return
	}
	logger.Info("Kapacitor Initialization ended")

	listAllAlerts, listAllAlertsErr := kapacitor.ListTasks()

	if listAllAlertsErr != nil {
		logger.Error("Listing alerts failed!")
	}

	var count = 0

	logger.Info("Deleting all existing alerts started")
	for count < len(listAllAlerts) {
		logger.Info("Deleting alert with Id:", listAllAlerts[count].ID)
		deleteAlertErr := kapacitor.DeleteTask(listAllAlerts[count].ID)
		if deleteAlertErr != nil {
			logger.Error("Deleting Alert Failed or No alert exist with the Id.", deleteAlertErr)
			count++
			continue
		}
		count++
		logger.Info("Deleting alert successful")
	}

	logger.Info("Deleting all existing alerts ended")
}
