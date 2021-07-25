//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package globalconstants

import "time"
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

var AlertManagerVersion = "0.1"
var Drive = getroot()
var SpiaFolder = "SPIA"
var LogPath = Drive + SpiaFolder + "/Logs/AlertManager/AlertManagerLog.txt"
var KapacitorLogPath = Drive + SpiaFolder + "/Logs/AlertManager/KapacitorLog.txt"
var ConfigurationPath = Drive + SpiaFolder + "/Config/AlertManagerConfig.json"

var MaxNumberofAlertManagerLogFiles = 20
var MaxSizeofAlertManagerLogFiles = 10 //In MB
var MaxNumberofKapacitorLogFiles = 20
var MaxSizeofKapacitorLogFiles = 10 //In MB

var TopicRoot = "spiai4suite"
var SMTPSettings = TopicRoot + "/alertmanager/smtp"
var SMSSettings = TopicRoot + "/alertmanager/sms"
var AlertSettings = TopicRoot + "/alertmanager/alertconfig"
var AlertConfigSettings = TopicRoot + "/alertmanager/alertsettings"

var KapacitorConfPath = "/kapacitor-1.5.3/kapacitor.conf"
var KapacitorBatchPath = "/run-kapacitor.bat"
var TimeDelayBeforeRestartInSec time.Duration = 5

var MqttUsername = "spiai4user"
var MqttPassword = "All your sensors are mine"
var MqttCleanSession = true
var MqttNoOfMessages = 1

var DefaultPeriod = `1s`

var DefaultSMTPPort = "465"

var CollectDatabase = "active_realtime"
var CollectRetentionPolicy = "Pol_RP"

var AlertDatabase = "alert_stat"
var AlertMeasurement = "alerthist"

var TSDBAddress = "http://localhost:8086"
var TSDBUsername = "spiai4writeuser"
var TSDBPassword = "All your write sensors are mine"
var CreateDatabaseQuery = "CREATE DATABASE "

var ActivationdelayFunction = "ACTIVATIONDELAY"
var Meanfunction = "MEAN"
var Medianfunction = "MEDIAN"
var Maxfunction = "MAX"
var Minfunction = "MIN"
var Sumfunction = "SUM"
var Differencefunction = "DIFFERENCE"
var Lastfunction = "LAST"

var EmailMessageType = "email"

var GreaterThan = ">"
var LessThan = "<"
var GreaterThanOrEqual = ">="
var LessThanOrEqual = "<="

var DeadbandCondition = map[string]string{
	GreaterThan:        LessThan,
	LessThan:           GreaterThan,
	GreaterThanOrEqual: LessThan,
	LessThanOrEqual:    GreaterThan,
}

var MessageValueFormat = `{{index .Fields "value"}}`
var MessageTimeFormat = `{{ .Time }}`

//var MessageTagInfoFormat = `{{ index .Tags "TAGINFO" }}`
var MessageFuncValueFormat = `{{index .Fields "funcval"}}`

var ActivationDelayTickContent = `|stateDuration(lambda: $TYPE$ $CONDITION$ $VALUE$)
        .unit(1$UNIT$)`

var CommonFunctionTickContent = `|$FUNCTION$('VALUE')
        .as('funcval')`

var LastFunctionTickContent = `|last('VALUE')
        .as('value')`

var ActivationDelayInfoTickContent = `"state_duration" >= $TIME$`

var CommonFunctionTickCondition = `"funcval" $CONDITION$ $VALUE$`

var LastFunctionTickCondition = `"value" $CONDITION$ $VALUE$`

var TickdbSelectionContent = `dbrp "active_realtime"."Pol_RP"`

var TickContent = `

stream
    |from()
        .measurement('TagValues')
		.where(lambda: "TAGID" == '$TAGIDREPLACE$')
        .groupBy('TAGID')
    |window()
        .period($PERIODREPLACE$)
        .every($INTERVALREPLACE$)
    $FUNCTION$
    $ACTIVATIONDELAY$
    |alert()
        .message('$MESSAGEREPLACE$')
        $EMAILMESSAGECONTENT$
        $CONDITIONREPLACE$
        $DEADBAND$
        $IGNOREOKMESSAGE$
        // Send alert to hander of choice.
        $MQTT$
        $ACTIONREPLACE$
    $INFLUXDBOUT$`

var DifferenceTickContent = `var data = stream
    |from()
        .measurement('TagValues')
        .where(lambda: "TAGID" == '$TAGIDREPLACE$')
        .groupBy('TAGID')
    |window()
        .period($PERIODREPLACE$)
        .every($INTERVALREPLACE$)
    
var last = data
    |last('VALUE')
        .as('value')

var first = data
    |first('VALUE')
        .as('value')

var joinedData = first
    |join(last)
        .as('first','last')
        
joinedData
    |eval(lambda: "last.value" - "first.value")
        .as('funcval')
    $ACTIVATIONDELAY$
    |alert()
        .message('$MESSAGEREPLACE$')
        $EMAILMESSAGECONTENT$
        $CONDITIONREPLACE$
        $DEADBAND$
        $IGNOREOKMESSAGE$
        // Send alert to hander of choice.
        $MQTT$
        $ACTIONREPLACE$
    $INFLUXDBOUT$`

var IgnoreOkMessageTickContent = `.noRecoveries()`

var InfluxdbOutCondition = `|influxDBOut()
        .database('$DATABASE$')
        .retentionPolicy('autogen')
        .measurement('$MEASUREMENT$')
        .tag('TAGINFO', '$TAGINFO$')
        .tag('ALERT', '$ALERTNAME$')`

var MqttTickContent = `.mqtt('/i4suite/alertmanager/$TAGIDREPLACE$')
        .brokerName('localhost')
        .qos(1)`

var TickMessageContent = `
{
    "alert":"{alertname}",
    "tagname":"{tagname}", 
    "value": "{{ index .Fields "$VALUE$" }}", 
    "time":"{{ .Time }}"
}`

var TickDifferenceMessageContent = `
{
    "alert":"{alertname}",
    "tagname":"{tagname}", 
    "value": "{{ index .Fields "funcval" }}", 
    "time":"{{ .Time }}"
}`

var TickInfoCondition = `.info(lambda: $INFOCONDITION$)`

var TickDeadbandCondition = `.infoReset(lambda: $TYPE$ $CONDITION$ $VALUE$)`

var TickFunctionTypeVal = "funcval"

var TickFunctionTypeValInQuotes = `"funcval"`

var TickWarningCondition = `
		.warn(lambda: $WARNCONDITION$)`
var TickCriticalCondition = `
		.crit(lambda: $CRITCONDITION$)`

var TickEmailContent = `.email()`

var TickEmailMessageContent = `.details('
            <h4>$SUBJECT$</h4>
            <b>$MESSAGE$</b>
            ')`

var TickEmailToContent = `
			.to('$EMAILID$')`

var TickSMSEndPointContent = `
        .post()
            .endpoint('$ENDPOINT$')`
var KapacitorSMSPostContent = `$TOKENVARNAME$=$SMSTOKEN$&$NUMBERSVARNAME$=$PHONENUMBERS$&$MESSAGEVARNAME$={{.Message}}%ni4Suite Alert&$SENDERVARNAME$=$SENDER$`

var SMSConfigContent = `

[[httppost]]
  endpoint = "$ENDPOINT$"
  url = $URL$
  headers = { Content-Type = "application/x-www-form-urlencoded" }
  alert-template = '$ALERTTEMPLATE$'`

var SMTPIdleTimeOut = `"50s"`

var RegularExpressionForSMTP = `(?s)smtp(.*)idle-timeout = ` + SMTPIdleTimeOut

var SMTPConfigContent = `smtp]
  enabled = true
  host = $HOST$
  port = $PORT$
  username = $USERNAME$
  password = $PASSWORD$
  no-verify = false
  global = true
  state-changes-only = true
  from = $FROM$
  idle-timeout = ` + SMTPIdleTimeOut
