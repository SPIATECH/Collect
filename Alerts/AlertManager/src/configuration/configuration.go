//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package configuration

//ConfigurationName Application info
var ConfigurationName string = "AlertManager Configuration"

//Configuration for Alert Manager
type Configuration struct {
	Version               string
	MqttBroker            string
	TickFilesPath         string
	IntervalPeriod        string
	KapacitorAddress      string
	KapacitorPath         string
	LoadConfigOnStart     bool
	InfluxdbOut           bool
	IsKapacitorLogEnabled bool
	SMTPConfigPath        string
	SMSConfigPath         string
	TagConfigPath         string
}

//NewConfiguration To get port number
func NewConfiguration() Configuration {
	return Configuration{}
}
