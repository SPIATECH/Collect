//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package synchConfigs

type tag struct {
	Tagid   string `json:"tagid"`
	Tagname string `json:"tagname"`
	Type    string `json:"type"`
	Mode    string `json:"mode"`
	Start   string `json:"start"`
	Delta   string `json:"delta"`
}

type SynchConfig struct {
	Devicetoken           string `json:"devicetoken"`
	LastValuePeriod       string `json:"lastvalueperiod"`
	HistoricalValuePeriod string `json:"historicalvalueperiod"`
	Tags                  []tag  `json:"tags"`
}

type SynchConfigs struct {
	Configs []SynchConfig `json:"configs"`
}
