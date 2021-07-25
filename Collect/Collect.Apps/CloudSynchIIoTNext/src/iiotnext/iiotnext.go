//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package iiotnext

import (
	"fmt"
	"os"
	"strings"

	_ "github.com/influxdata/influxdb1-client" // this is important because of the bug in go mod
	client "github.com/influxdata/influxdb1-client/v2"
	"github.com/monaco-io/request"
	log "github.com/sirupsen/logrus"
	config "spiatech.com/CloudSynchIIoTNext/v1/configuration"
	"spiatech.com/CloudSynchIIoTNext/v1/globalconstants"
	syncConfig "spiatech.com/CloudSynchIIoTNext/v1/syncConfigs"

	//"strings"
	"encoding/json"
	"io/ioutil"
	"net"
	"strconv"
	"time"

	"github.com/syndtr/goleveldb/leveldb"
)

var IsLastValueHistorySyncRunning bool = false
var seconds int = globalconstants.Seconds
var timeOut time.Duration = time.Duration(seconds) * time.Second

func SyncValueWithIIoTNext(db *leveldb.DB, config config.Configuration, logger *log.Entry) {

	cfile := globalconstants.CloudSynchConfigPath

	if _, err := os.Stat(cfile); err != nil {
		logger.Error("File does not exist: ", cfile)
		return
	}

	content, err := ioutil.ReadFile(cfile)
	if err != nil {
		logger.Error("File Read Failed: ", cfile)
		return
	}
	logger.Info(string(content))

	bytes := []byte(content)
	var conf syncConfig.SynchConfigs
	errm := json.Unmarshal(bytes, &conf)
	if errm != nil {
		logger.Error("JSON Unmarshal Failed, ", errm)
		return
	}
	logger.Info("LastValuePeriod = ", conf.Configs[0].LastValuePeriod)
	logger.Info("HistoricalValuePeriod = ", conf.Configs[0].HistoricalValuePeriod)
	logger.Info("DeviceToken = ", conf.Configs[0].Devicetoken)
	logger.Info("Tags = ", conf.Configs[0].Tags)

	lastvalueinterval, lastvalueintervalParseError := time.ParseDuration(conf.Configs[0].LastValuePeriod)
	if lastvalueintervalParseError != nil {
		//fmt.Println(intervalParseError)
		logger.Error("Wrong interval Format! Format should be 5000ms , 5s etc")
		return
	}

	historicalvalueinterval, historicalvalueintervalParseError := time.ParseDuration(conf.Configs[0].HistoricalValuePeriod)
	if historicalvalueintervalParseError != nil {
		//fmt.Println(intervalParseError)
		logger.Error("Wrong interval Format! Format should be 5000ms , 5s etc")
		return
	}

	ticker := time.NewTicker(lastvalueinterval)

	Devicetoken := conf.Configs[0].Devicetoken
	Tags := conf.Configs[0].Tags
	realtimedbname := globalconstants.CollectDatabase
	historicaldbname := globalconstants.CollectHistoricalDatabase

	//To push Historical Tags to IIoTNext
	for i, t := range Tags {
		logger.Info("Pushing ", i, ":", t.Tagname, " values to IIoTNext in Historical Mode")
		if t.Type == globalconstants.TelemetryType && t.Mode == globalconstants.HistoricalMode {
			logger.Info("Historical Telemetry Mode")
			go pushhistoricalvaluetoIIoTNext(db, historicalvalueinterval, historicaldbname, config, t.Tagname, t.Tagid, t.Delta, t.Start, Devicetoken, logger)
		}
	}

	//To Push Last Value and Attribute Value to IIoTNext
	for _ = range ticker.C {
		for i, t := range Tags {
			logger.Info("Pushing ", i, ":", t.Tagname, " values to IIoTNext in Last value Mode")
			//fmt.Println(i,":",t.Tagname)
			if t.Type == globalconstants.TelemetryType && t.Mode == globalconstants.LastValueMode {
				logger.Info("Telemetry Mode")
				if t.Mode == "last" {
					go pushLastValueAndAttributeValuetoIIoTNext(realtimedbname, t.Type, config, t.Tagname, t.Tagid, t.Delta, Devicetoken, logger)
				} else {
					logger.Error("Invalid combinations provided!Please check the mode and type")
				}
			} else if t.Type == globalconstants.AttributeType {
				logger.Info("Attribute Mode")
				go pushLastValueAndAttributeValuetoIIoTNext(realtimedbname, t.Type, config, t.Tagname, t.Tagid, t.Delta, Devicetoken, logger)
			}
		}
	}

}

func pushLastValueAndAttributeValuetoIIoTNext(databaseName string, reqType string, config config.Configuration, tagname string, tagid string, delta string, devicetoken string, logger *log.Entry) {

	c, err := client.NewHTTPClient(client.HTTPConfig{
		Addr:     config.Tsdbserver,
		Username: globalconstants.TSDBUsername,
		Password: globalconstants.TSDBPassword,
	})

	if err != nil {
		logger.Error("Error creating InfluxDB Client: ", err.Error())
		return
	}

	logger.Info("created InfluxDB Client: ", c)

	defer c.Close()

	var query = ""

	if delta == "" {
		logger.Info("No delta value. Using default delta interval 5s")
		query = globalconstants.QueryToReadLastValuePart + tagid + globalconstants.QueryToReadLastValueDefaultTime + globalconstants.QueryToReadValueOrderbyLimit1
	} else {
		logger.Info("Delta value applied in query. Using delta interval:", delta)
		query = globalconstants.QueryToReadLastValuePart + tagid + globalconstants.QueryToReadLastValueDeltaTime + delta + globalconstants.QueryToReadValueOrderbyLimit1
	}

	var iiotNextUrl string = ""
	logger.Info("Query: ", query)
	if reqType == globalconstants.TelemetryType {
		iiotNextUrl = config.Protocol + "://" + config.HostName + globalconstants.IIoTNextAPIUrl + devicetoken + globalconstants.IIoTNextTelemetryApiUrlParam
	} else if reqType == globalconstants.AttributeType {
		iiotNextUrl = config.Protocol + "://" + config.HostName + globalconstants.IIoTNextAPIUrl + devicetoken + globalconstants.IIoTNextAttributeApiUrlParam
	}
	q := client.NewQuery(query, databaseName, "ms")

	if response, err := c.Query(q); err == nil && response.Error() == nil {
		//fmt.Println(response.Results);
		logger.Info(response.Results)

		var dataResponse = response.Results

		if len(dataResponse) > 0 && len(dataResponse[0].Series) > 0 {

			var myData [][]interface{} = make([][]interface{}, len(dataResponse[0].Series[0].Values))
			for i, d := range dataResponse[0].Series[0].Values {
				myData[i] = d
			}

			logger.Info("Query Result:", myData[0]) //first element in slice
			//fmt.Println("Time:", myData[0][0])
			//fmt.Println("Value:", myData[0][1])

			logger.Info("Converting value and time to string")
			val := fmt.Sprintf("%v", myData[0][1])
			valTime := fmt.Sprintf("%v", myData[0][0])

			var data string = ``
			if reqType == globalconstants.TelemetryType {
				data = `{"ts":` + valTime + `,"values":`
				data = data + `{"` + tagname + `":` + val + `}`
				data = data + `}`
			} else if reqType == globalconstants.AttributeType {
				data = `{"` + tagname + `":` + val + `}`
			}
			logger.Info("url:" + iiotNextUrl)
			logger.Info("data:" + data)
			//fmt.Println("data:", data)

			httpClient := request.Client{
				URL:    iiotNextUrl,
				Method: "POST",
				//Params: map[string]string{"hello": "world"},
				Body: []byte(data),
			}
			resp, err := httpClient.Do()
			logger.Info(resp.Code, string(resp.Data), err)

			if resp.Code != 200 || err != nil {
				logger.Error("Pushing data for ", tagname, ":", tagid, " Failed!")
			} else {
				logger.Info("Data for ", tagname, ":", tagid, ":", valTime, " Successful.")
			}
		}

	}

}

func pushhistoricalvaluetoIIoTNext(db *leveldb.DB, interval time.Duration, databaseName string, config config.Configuration, tagname string, tagid string, delta string, start string, devicetoken string, logger *log.Entry) {

	historicalticker := time.NewTicker(interval)

	for _ = range historicalticker.C {
		// Remember that the contents of the returned slice should not be modified.
		lastSynced, err := db.Get([]byte(tagid), nil)

		var lastSyncedTime time.Duration

		if err != nil {
			//fmt.Println(tagname , ":" , tagid ,": No previous insert time exist")
			logger.Error(tagname, ":", tagid, ": No previous insert time exist")
		} else {
			//fmt.Println(tagname , ":" , tagid ,": LastSynced Time:" , lastSynced)
			logger.Info(tagname, ":", tagid, ": LastSynced Time:", lastSynced)
			lastsyncedtimeformatted, lastsyncedtimeParseError := time.ParseDuration(string(lastSynced))
			if lastsyncedtimeParseError != nil {
				//fmt.Println(lastsyncedtimeParseError)
				logger.Error("Wrong format for Lastsynced time in db")
				//defer db.Close()
				return
			}
			//fmt.Println("Lastsyncedtime:",lastsyncedtimeformatted)
			lastSyncedTime = lastsyncedtimeformatted
		}

		if CheckIfHostIsReachable(config, logger) {

			endTime := (time.Now().UnixNano() / int64(time.Millisecond))
			startTime := lastSyncedTime.Milliseconds()

			//fmt.Println("Starttime:",startTime)
			//fmt.Println("Endtime:",endTime)

			if startTime == 0 {
				if start != "" {
					t, terror := time.Parse(time.RFC3339, start)
					if terror != nil {
						logger.Error("Incorrect Date Time format given for start time")
						return
					} else {
						startTime = (t.UnixNano() / int64(time.Millisecond))
					}
				}
			}

			//fmt.Println("Starttime:",startTime)
			logger.Info("StartTime:", startTime)

			c, err := client.NewHTTPClient(client.HTTPConfig{
				Addr:     config.Tsdbserver,
				Username: globalconstants.TSDBUsername,
				Password: globalconstants.TSDBPassword,
			})

			if err != nil {
				//fmt.Println("Error creating InfluxDB Client: ", err.Error())
				logger.Error("Error creating InfluxDB Client: ", err.Error())
				return
			}
			//fmt.Println("created InfluxDB Client: ", c)
			logger.Info("created InfluxDB Client: ", c)

			defer c.Close()

			var query = ""

			//Converting starttime and endtime to nanoseconds from milliseconds
			//as influxdb supports time in nanosecond format
			st := strconv.FormatInt(startTime*int64(globalconstants.MillisecondtoNanoSecond), globalconstants.MillisecondtoNanoSecondDecimalValue)
			et := strconv.FormatInt(endTime*int64(globalconstants.MillisecondtoNanoSecond), globalconstants.MillisecondtoNanoSecondDecimalValue)
			if startTime == 0 && start == "" {
				logger.Info(tagname, ": Start time not provided, so pushing the entire historical tag data!")
				query = globalconstants.QueryToReadLastValuePart + tagid + "' " + globalconstants.QueryToReadLastValueHistoricalTimePart2 + et + globalconstants.QueryToReadValueOrderbyWithoutLimit + config.Limit
			} else {
				logger.Info(tagname, ": Start time provided, so pushing the historical tag data from start time")
				query = globalconstants.QueryToReadLastValuePart + tagid + globalconstants.QueryToReadLastValueHistoricalTimePart1 + st + globalconstants.QueryToReadLastValueHistoricalTimePart2 + et + globalconstants.QueryToReadValueOrderbyWithoutLimit + config.Limit
			}
			//fmt.Println("Query: ", query)
			logger.Info(tagname, ": Query: ", query)

			iiotNextUrl := config.Protocol + "://" + config.HostName + globalconstants.IIoTNextAPIUrl + devicetoken + globalconstants.IIoTNextTelemetryApiUrlParam

			q := client.NewQuery(query, databaseName, "ms")

			var dataToSend = "["
			var lastInsertedTime = ""

			if response, err := c.Query(q); err == nil && response.Error() == nil {
				//fmt.Println("Result:",response.Results);
				logger.Info(response.Results)
				var dataResponse = response.Results
				if len(dataResponse) > 0 && len(dataResponse[0].Series) > 0 {

					for i, d := range dataResponse[0].Series[0].Values {
						logger.Info("Query Result:", i, ":", d) //first element in slice
						logger.Info("Time:", d[0])
						logger.Info("Value:", d[1])

						logger.Info("Converting value and time to string")
						val := fmt.Sprintf("%v", d[1])
						valTime := fmt.Sprintf("%v", d[0])
						lastInsertedTime = valTime

						var data string = `{"ts":` + valTime + `,"values":`
						data = data + `{"` + tagname + `":` + val + `}`
						data = data + `},`

						dataToSend = dataToSend + data
					}

					dataToSend = dataToSend + "]"

					dataToSend = strings.ReplaceAll(dataToSend, ",]", "]")

					logger.Info("url:" + iiotNextUrl)
					logger.Info("data:" + dataToSend)
					//fmt.Println("data:", data)

					httpClient := request.Client{
						URL:    iiotNextUrl,
						Method: "POST",
						//Params: map[string]string{"hello": "world"},
						Body: []byte(dataToSend),
					}
					resp, err := httpClient.Do()
					logger.Info("Response:", resp.Code, string(resp.Data), err)

					if resp.Code != 200 || err != nil {
						logger.Error("Pushing data for ", tagname, ":", tagid, " Failed!")
					} else {
						logger.Info("Data for ", tagname, ":", tagid, ":", lastInsertedTime, " Successful. Updating last inserted")
						dbErr := db.Put([]byte(tagid), []byte(lastInsertedTime+"ms"), nil)

						if dbErr != nil {
							logger.Error("Updating last inserted time failed!", tagid, ":", tagname, ":", lastInsertedTime)
						}
					}
					//}
				}
			}
		}
	}

}

func CheckIfHostIsReachable(config config.Configuration, logger *log.Entry) bool {

	hostconn, hosterr := net.DialTimeout("tcp", config.HostName+":"+config.PortNum, timeOut)

	if hosterr != nil {
		fmt.Println(hosterr)
		return false
	}

	logger.Info("Connection established between", config.HostName, " and localhost with time out of ", int64(seconds), " seconds.")
	logger.Info("Remote Address :", hostconn.RemoteAddr().String())
	logger.Info("Local Address :", hostconn.LocalAddr().String())
	return true
}
