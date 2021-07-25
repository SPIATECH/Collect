//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

var opsys = process.platform;
var drive = "C:"

if (opsys == "darwin") {
    opsys = "MacOS";
} else if (opsys == "win32" || opsys == "win64") {
    opsys = "Windows";
    drive = "C:"
} else if (opsys == "linux") {
    opsys = "Linux";
    drive = "/opt"
}

var logPath = `${drive}/SPIA/Logs/Collect.Apps/OPCUA/OPCUA-log.txt`
const logFileExpiry = 60
const logFileRotationSize = 10 * 1024 * 1024 //10MB
const logFileNumberOfFiles = 10

var configFilePath = `${drive}/SPIA/Config/OPCUAConfig.json`
var tagConfigFilePath = `${drive}/SPIA/AppData/OPCUA/tagconfig.json`

var influxUser = "spiai4writeuser"
var influxPassword = "All your write sensors are mine"
var influxDatabase = "active_historical"
var influxUrl = `http://${influxUser}:${influxPassword}@INFLUXIP/${influxDatabase}`

// exports the variables and functions above so that other modules can use them
module.exports.logPath = logPath;
module.exports.logFileExpiry = logFileExpiry;
module.exports.configFilePath = configFilePath;
module.exports.tagconfigFilePath = tagConfigFilePath;
module.exports.logFileRotationSize = logFileRotationSize;
module.exports.logFileNumberOfFiles = logFileNumberOfFiles;

module.exports.influxUrl = influxUrl;
