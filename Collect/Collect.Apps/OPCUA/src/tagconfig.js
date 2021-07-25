//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

const AJV = require('ajv')
const fs = require('fs-extra')
const path = require('path')
const toml = require('toml')
var constants = require('./globalconstants')

const loc = constants.tagconfigFilePath

let load = () => {
  let file = fs.readFileSync(loc)
  let text

  // parse the file as TOML if it has a .toml extension.
  if (path.extname(loc).toLowerCase() === '.toml') {
    text = toml.parse(file)
  } else {
    text = JSON.parse(file)
  }

  // validate the resulting JSON against the config schema
  let schema = require('./schema/tagconfigschema.json')
  let ajv = new AJV()

  if (!ajv.validate(schema, text)) {
    throw new Error(ajv.errors[0].dataPath + ': ' + ajv.errors[0].message)
  }

  return text
}

module.exports = { load }
