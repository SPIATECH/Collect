//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package tsdb

import (
    "time"
    client "github.com/influxdata/influxdb-client-go/v2"
    "github.com/influxdata/influxdb-client-go/v2/api"
    //"github.com/influxdata/influxdb-client-go/v2/api/http"
    // "github.com/influxdata/influxdb-client-go/v2/domain"
    "github.com/fatih/structs"
	log "github.com/sirupsen/logrus"
	"spiatech.com/TagProcessing/v1/globalconstants"
	datain "spiatech.com/TagProcessing/v1/datain"
)

// ProductMeasurement schema of product measurement
type DPFields struct {
    VALUE float64
}


type DPTags struct {
    TagId string
    Tagname string
    Device string
    Group string
    ParentGroup string
    MasterGroup string
}

// Module variables
var c client.Client
var writeR api.WriteAPI
var writeH api.WriteAPI
var err error

func Init(tsdbserver string, logger *log.Entry){

    logger.Debug("Insert function started")
    logger.Info(" TSDB Server ", tsdbserver)

    c := client.NewClientWithOptions(tsdbserver, globalconstants.TSDBToken, client.DefaultOptions().SetBatchSize(globalconstants.TSDBBatchSize))

    writeR = c.WriteAPI(globalconstants.TSDBOrg, globalconstants.CollectDatabase)
    writeH = c.WriteAPI(globalconstants.TSDBOrg, globalconstants.CollectDatabaseHist)
    // Create go proc for reading and logging errors
    // This is a go routing, which runns in the background
    // Get errors channel
    errorsChR := writeR.Errors()
    go func() {
        for err := range errorsChR {
            logger.Error("Realtime write error: %s\n", err.Error())
        }
    }()

    errorsChH:= writeR.Errors()
    go func() {
        for err := range errorsChH {
            logger.Error("Realtime write error: %s\n", err.Error())
        }
    }()

}

func Insert(data datain.Datain, logger *log.Entry){

    logger.Info("Tagname = ", data.Tagname)
    fields := DPFields {data.Value}
    // Tags must be a map of strings
    tags :=  map[string]string {
        datain.TagIDColumnName   : data.TagId,
        datain.TagNameColumnName : data.Tagname,
        datain.DeviceColumnName  : data.Device,
        datain.GroupColumnName   : data.Group,
        datain.ParentColumnName  : data.ParentGroup,
        datain.MasterColumnName  : data.MasterGroup }

    logger.Info(fields)
    logger.Info(tags)

    pt := client.NewPoint(globalconstants.CollectMeasurement, tags, structs.Map(fields), time.Unix(data.Timestamp, 0))

    // Write the batch
    writeR.WritePoint(pt)
    writeH.WritePoint(pt)
}

func deinit(logger *log.Entry) {

    // Close client resources
    c.Close();

}




