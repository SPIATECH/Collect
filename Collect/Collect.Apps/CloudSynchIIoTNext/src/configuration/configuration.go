//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package configuration

//ConfigurationName Application info
var ConfigurationName string = "CloudSynchIIoTNext Configuration"

//Configuration 
type Configuration struct {
	Mqttbroker         string
	Tsdbserver         string
	HostName		   string
	PortNum		   	   string
	Protocol		   string
	Limit			   string
}

//NewConfiguration To get port number
func NewConfiguration() Configuration {
	return Configuration{}
}
