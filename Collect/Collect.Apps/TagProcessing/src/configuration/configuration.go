//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package configuration

//ConfigurationName Application info
var ConfigurationName string = "TagProcessing Configuration"

//Configuration 
type Configuration struct {
	Version            string
	Mqttbroker         string
	Tsdbserver         string
}

//NewConfiguration To get port number
func NewConfiguration() Configuration {
	return Configuration{}
}
