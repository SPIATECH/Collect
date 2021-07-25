//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package smtpconfig

//ConfigurationName Application info
var ConfigurationName string = "AlertManager SMTP Configuration"

//The changes made here should also be made in SMTP Mqtt listener
//inside alertmanager.go
//SMTPConfiguration for Alert Manager
type SMTPConfiguration struct {
	Host     	 string `json:"host"`
	Port     	 string `json:"port"`
	SMTPUserName string `json:"smtpusername"`
	Password 	 string `json:"password"`
	From     	 string `json:"from"`
}

//NewSMTPConfiguration To get port number
func NewSMTPConfiguration() SMTPConfiguration {
	return SMTPConfiguration{}
}
