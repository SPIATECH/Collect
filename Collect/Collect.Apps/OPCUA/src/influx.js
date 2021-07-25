//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

var constants = require('./globalconstants')
let Influx = require('influx')
let log = require('log4js').getLogger('influx')

let INFLUX = null

async function start (ipAddress) {
  let influxUrl = constants.influxUrl
  log.info(`Influx IpAddress:${ipAddress}`);

  INFLUX = new Influx.InfluxDB(influxUrl.replace("INFLUXIP",ipAddress))
  let host = (await INFLUX.ping(5000))[0]
  if (host.online) {
    log.info(`${host.url.host} responded in ${host.rtt}ms running ${host.version}`)
  } else {
    log.warn(`${host.url.host} is offline :(`)
  }
}

async function write (points) {
  let pts = points.map((p) => {
    let tags = p.tags || {}
    //tags.status = p.status

    let fields = { VALUE: p.value }
    if (p.datatype === 'boolean') fields.value_num = p.value * 1
    return {
      measurement: p.measurement,
      tags,
      fields,
      timestamp: p.timestamp
    }
  })

  try {
    await INFLUX.writePoints(pts)
  } catch (e) {
    if (e.message.includes('partial write')) {
      log.warn(e.message)
      return
    }
    log.error(e.message)
    throw e
  }
}
module.exports = { start, write }
