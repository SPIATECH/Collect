//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {Setting, SettingRelations} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class SettingRepository extends VersionedEntityRepository<
  Setting,
  typeof Setting.prototype.key,
  SettingRelations
> {
  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(Setting, dataSource, mqttService, logger, config);
  }

  getTopicRoot(): string {
    return 'SETTING';
  }
}
