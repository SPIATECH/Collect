//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package datain

type Datain struct {
    Tagname string `json:"tagname"`
    Value float64 `json:"value"`
    Timestamp int64 `json:"timestamp"`
    Device string `json:"device"`
    TagId string `json:"tagid"`
    Group string `json:"group"`
    ParentGroup string `json:"parentgroup"`
    MasterGroup string `json:"mastergroup"`
}

var TagIDColumnName = "TAGID"
var TagNameColumnName = "TAGNAME"
var DeviceColumnName = "DEVICE"
var GroupColumnName = "GROUP"
var ParentColumnName = "PARENT"
var MasterColumnName = "MASTER"

