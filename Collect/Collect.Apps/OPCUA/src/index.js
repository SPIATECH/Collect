//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

const log = require('./logging.js').getLogger('main')
const analytics = require('./analytics.js')
const config = require('./config.js')
const tagconfig = require('./tagconfig.js')
const influx = require('./influx.js')
const buffer = require('./buffer.js')
const opcua = require('./opcua.js')

let conf = config.load()
let tagConf = tagconfig.load()

// Catch all 'bad' events and try a gracefull shutdown
let shutdownSignalCount = 0
async function gracefullShutdown (e) {
  log.fatal(e)
  shutdownSignalCount++
  if (shutdownSignalCount > 1) return
  await buffer.stop()
  process.exit(0)
}

opcua.EVENTS.on('connection_break', async () => { await gracefullShutdown('connection_break') })
opcua.EVENTS.on('sequential_polling_errors', async () => { await gracefullShutdown('sequential_polling_errors') })
process.on('SIGTERM', async () => { await gracefullShutdown('received SIGTERM') })
process.on('SIGINT', async () => { await gracefullShutdown('received SIGINT') })

// MAIN LOGIC IN IIFE

;(async () => {
  try {
    log.info(`Starting Collect-x OPCUA`)

    //
    // Init influxclient
    //

    log.info('Initialising influxClient')
    await influx.start(conf.influx.url)

    //
    // Create and start the buffer.
    //

    log.info('Initialising buffer')
    await buffer.start(influx.write)

    //
    // Create and start the OPCUA connection.
    //

    log.info('Connecting OPCUA')
    await opcua.start(conf.opcua)
    opcua.EVENTS.on('points', (pts) => buffer.addPoints(pts))

    //
    // Add all metrics to the OPCUA Session
    //
    for (let m of tagConf.metrics) {
      opcua.addMetric(m)
    }

    //
    // If not disabled, send anonymous usage stats
    //
    if (!process.env.DISABLE_ANALYTICS) await analytics.start(tagConf.metrics.length)
  } catch (e) {
    gracefullShutdown(e)
  }
})()
