//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {bind, /* inject, */ BindingScope} from '@loopback/core';

import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import fs from 'fs';
import os from 'os';

@bind({scope: BindingScope.SINGLETON})
export class ConfigurationService {
  constructor(
    public finalConfigs: CollectConfigurationConstants = new CollectConfigurationConstants(),
  ) {}
  getConfiguration(): CollectConfigurationConstants {
    return this.finalConfigs;
  }

  readConfiguration(): CollectConfigurationConstants {
    let fileConfig = {};

    try {
      const configFileName: string = this.getConfigurationFileName();

      fileConfig = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
    } catch (Error) {
      console.error(Error.message);
      console.log('Using default configuration', this.finalConfigs);
    }
    this.finalConfigs = {...this.finalConfigs, ...fileConfig};

    this.finalConfigs = this.parsePropertiesOfObject(this.finalConfigs)

    return this.finalConfigs;
  }

  parsePropertiesOfObject(object:any,prefix="TAG_"):any{
    for (let key in object){
      if("object" === typeof object[key]){
        object[key] = this.parsePropertiesOfObject(object[key],prefix + key.toUpperCase() + "_");
      }else{
        let env_key = prefix+key
        object[key] = process.env[env_key] ?? object[key];
      }
    }
    return object;
  }

  getConfigurationFileName(): string {
    const platform = os.platform();
    let filename = 'config.json';
    if (platform === 'win32') {
      filename = this.finalConfigs.CONFIG_FILE_LOCATION_WIN32;
    } else {
      // first check the existence in /etc/ folder - which takes precedence.
      filename = this.finalConfigs.CONFIG_FILE_LOCATION_NIX;
    }

    if (!this.checkFileExistence(filename)) {
      return this.finalConfigs.DEFAULT_CONFIG_FILENAME;
    }
    return filename;
  }

  getLogFileName(): string {
    const platform = os.platform();
    let filename = 'alert-web-server.log';
    if (platform === 'win32') {
      filename = this.finalConfigs.LOG_FILE_LOCATION_WIN32;
    } else {
      // first check the existence in /etc/ folder - which takes precedence.
      filename = this.finalConfigs.LOG_FILE_LOCATION_NIX;
    }
    return filename;
  }

  getDatabaseFileName(): string {
    const platform = os.platform();
    let filename = 'SpiaDb.db';
    if (platform === 'win32') {
      filename = this.finalConfigs.DATABASE_LOCATION_WIN32;
    } else {
      // first check the existence in /etc/ folder - which takes precedence.
      filename = this.finalConfigs.DATABASE_LOCATION_NIX;
    }
    return filename;
  }

  checkFileExistence(filename: string): boolean {
    try {
      fs.accessSync(filename, fs.constants.R_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
}
