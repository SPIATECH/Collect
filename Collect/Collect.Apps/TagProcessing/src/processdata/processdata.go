//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package processdata

import (
	_ "spiatech.com/TagProcessing/v1/globalconstants"
	log "github.com/sirupsen/logrus"
	datain "spiatech.com/TagProcessing/v1/datain"
	"spiatech.com/TagProcessing/v1/tsdb"
	"encoding/json"
)


func Init(tsdbserver string, logger *log.Entry){
    tsdb.Init(tsdbserver, logger)
}

func ProcessData(datainmsg string, logger *log.Entry){

    bytes := []byte(datainmsg)

    var in datain.Datain
    errm := json.Unmarshal(bytes, &in)
    if errm != nil {
        logger.Error("JSON Unmarshal Failed, ", errm)
        return
    }
    logger.Info("Incoming Data message de serialisation completed")
    logger.Info("Tagname = ", in.Tagname)
    tsdb.Insert(in, logger)

}

