//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {DefaultCrudRepository} from '@loopback/repository';
import {Config, ConfigRelations} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class ConfigRepository extends DefaultCrudRepository<
  Config,
  typeof Config.prototype.id,
  ConfigRelations
> {
  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @inject.getter('service.mqtt-service')
    private mqttService: Getter<MqttServiceService>,
    // not to confuse with the config object.
    @inject('app.config') private configuration: CollectConfigurationConstants,
    @inject('spia-logger') protected logger: SpiaLoggerService,
  ) {
    super(Config, dataSource);
  }

  async replaceById(
    id: typeof Config.prototype.id,
    config: Config,
  ): Promise<void> {
    await super.replaceById(id, config);

    await this.updateMqtt(config);
  }

  async updateById(
    id: typeof Config.prototype.id,
    config: Config,
  ): Promise<void> {
    await super.updateById(id, config);

    await this.updateMqtt(config);
  }
  // TODO : Not used any more
  // async findById(
  //   id: typeof Config.prototype.id,
  //   filter?: FilterExcludingWhere<Config>,
  //   options?: Options,
  // ): Promise<Config & ConfigRelations> {
  //   try {
  //     const findByIdPromise = await super.findById(id, filter, options);
  //     return await Promise.resolve<Config & ConfigRelations>(findByIdPromise);
  //   } catch (ex) {
  //     return await Promise.resolve<Config & ConfigRelations>(new Config({}));
  //   }
  // }

  async update(config: Config): Promise<void> {
    await super.update(config);

    await this.updateMqtt(config);
  }
  async create(config: Config): Promise<Config> {
    config = await super.create(config);

    await this.updateMqtt(config);

    return config;
  }

  async commitConfigs() {
    for (const key in this.configuration.CONFIG_TOPICS_MAPPING) {
      const topic: string = this.configuration.CONFIG_TOPICS_MAPPING[key];
      try {
        const conf = await this.findById(key);
        (await this.mqttService()).publishMessage(
          topic,
          Buffer.from(JSON.stringify(conf), 'utf8'),
        );
      } catch (ex) {
        this.logger.log(
          'Enetity doenst exist in config ' +
            key +
            ' when trying to send mqtt message',
        );
        (await this.mqttService()).publishMessage(
          topic,
          Buffer.from('', 'utf8'),
        );
      }
    }
  }

  async getCommitMessages() {
    const message: {[key: string]: {}} = {};
    for (const key in this.configuration.CONFIG_TOPICS_MAPPING) {
      let conf = {};
      try {
        conf = await this.findById(key);
      } catch (ex) {
        this.logger.log(
          'No config for ' + key + ' found, hence sending empty object {}',
        );
      }
      message[key] = conf;
    }
    return message;
  }

  async updateMqtt(config: Config): Promise<void> {
    if (config.id in this.configuration.CONFIG_TOPICS_MAPPING) {
      const topic: string = this.configuration.CONFIG_TOPICS_MAPPING[config.id];
      return (await this.mqttService()).publishMessage(
        topic,
        Buffer.from(JSON.stringify(config), 'utf8'),
      );
    }
  }
}
