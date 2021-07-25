//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {TagType, TagTypeRelations} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class TagTypeRepository extends VersionedEntityRepository<
  TagType,
  typeof TagType.prototype.name,
  TagTypeRelations
> {
  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(TagType, dataSource, mqttService, logger, config);
  }

  async getInstanceTopic(entity: TagType): Promise<string> {
    return Promise.resolve([this.getTopicRoot(), entity.id].join('/'));
  }

  getTopicRoot(): string {
    return 'TAG-TYPE';
  }
}
