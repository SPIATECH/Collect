//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package smsconfig

//ConfigurationName Application info
var ConfigurationName string = "AlertManager SMS Configuration"

//The changes made here should also be made in SMS Mqtt listener
//inside alertmanager.go
//SMTPConfiguration for Alert Manager
type SMSConfiguration struct {
	Url			 		string `json:"url"`
	TokenVarName     	string `json:"tokenvarname"`
	Token				string `json:"token"`
	NumbersVarName		string `json:"numbersvarname"`
	MessageVarName		string `json:"messagevarname"`
	SenderVarName		string `json:"sendervarname"`
	Sender				string `json:"sender"`
}

//NewSMTPConfiguration To get port number
func NewSMSConfiguration() SMSConfiguration {
	return SMSConfiguration{}
}
