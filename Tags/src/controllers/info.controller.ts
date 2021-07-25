//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

// Uncomment these imports to begin using these cool features!

import {get} from '@loopback/rest';
import {ConfigurationService} from '../services/configuration.service';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import os from 'os';

export class InfoController {
  protected config: CollectConfigurationConstants;
  protected configurationService: ConfigurationService = new ConfigurationService();
  constructor() {
    this.configurationService = new ConfigurationService();

    this.config = this.configurationService.readConfiguration();

    this.config.info.version =
      process.env.SPIAI4SUITEVERSION ?? this.config.info.version;
  }
  @get('/info', {
    responses: {
      '200': {
        description: 'Configuration Details',
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
      },
    },
  })
  async find(): Promise<{}> {
    this.config = this.configurationService.readConfiguration();

    this.config.info.version =
      process.env.SPIAI4SUITEVERSION ?? this.config.info.version;

    this.config.info.hostname = os.hostname();

    return Promise.resolve(this.config.info);
  }
}
