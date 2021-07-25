//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package tagconfig

//ConfigurationName Application info
var ConfigurationName string = "AlertManager Tag Configuration"

//Configuration for Email Info Settings
type EmailInfoSettings struct {
	Subject string `json:"subject"`
	Message string `json:"message"`
	To      string `json:"to"`
}

//Configuration for Email Info Settings
type SMSInfoSettings struct {
	Message string `json:"message"`
	To      string `json:"to"`
}

type AlertInfoType struct {
	Id        string `json:"id"`
	Condition string `json:"condition"`
	Value     string `json:"value"`
	Interval  string `json:"interval"`
	Unit      string `json:"unit"`
}

type Notifications struct {
	Id            string            `json:"id"`
	Enabled       bool              `json:"enabled"`
	Name          string            `json:"name"`
	Email         EmailInfoSettings `json:"emailinfo"`
	SMS           SMSInfoSettings   `json:"smsinfo"`
	RecoveryAlert bool              `json:"recoveryalert"`
}

//The changes made here should also be made in Alert Mqtt listener
//inside alertmanager.go
//Configuration for Alert Manager
type AlertTagSettings struct {
	Enabled         bool            `json:"enabled"`
	Id              string          `json:"id"`
	Name            string          `json:"name"`
	TagId           string          `json:"tagId"`
	FQTagName       string          `json:"FQTagName"`
	TagInfo         string          `json:"taginfo"`
	GroupId         string          `json:"groupid"`
	Type            string          `json:"type"`
	User            string          `json:"user"`
	DeadbandValue   string          `json:"deadbandvalue"`
	ActivationDelay string          `json:"activationDelay"`
	Unit            string          `json:"unit"`
	Context         string          `json:"context"`
	Function        string          `json:"function"`
	AlertInfo       AlertInfoType   `json:"alertinfo"`
	Notifications   []Notifications `json:"notifications"`
}

type AlertSettings struct {
	Alerts []AlertTagSettings `json:"alerts"`
}

//NewConfiguration To get port number
func NewConfiguration() AlertSettings {
	return AlertSettings{}
}
