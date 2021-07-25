//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DeviceType, DeviceTypeRelations, TagType, Device} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TagTypeRepository} from './tag-type.repository';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import {DeviceRepository} from './device.repository';

export class DeviceTypeRepository extends VersionedEntityRepository<
  DeviceType,
  typeof DeviceType.prototype.name,
  DeviceTypeRelations
> {
  public readonly tagTypes: HasManyRepositoryFactory<
    TagType,
    typeof DeviceType.prototype.name
  >;

  public readonly devices: HasManyRepositoryFactory<
    Device,
    typeof DeviceType.prototype.id
  >;

  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @repository.getter('TagTypeRepository')
    protected tagTypeRepositoryGetter: Getter<TagTypeRepository>,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('app.config') protected config: CollectConfigurationConstants,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @repository.getter('DeviceRepository')
    protected deviceRepositoryGetter: Getter<DeviceRepository>,
  ) {
    super(DeviceType, dataSource, mqttService, logger, config);
    this.devices = this.createHasManyRepositoryFactoryFor(
      'devices',
      deviceRepositoryGetter,
    );
    this.registerInclusionResolver('devices', this.devices.inclusionResolver);
    // this.properties = this.createHasManyRepositoryFactoryFor('properties', propertyRepositoryGetter,);
    // this.registerInclusionResolver('properties', this.properties.inclusionResolver);
    this.tagTypes = this.createHasManyRepositoryFactoryFor(
      'tagTypes',
      tagTypeRepositoryGetter,
    );
    this.registerInclusionResolver('tagTypes', this.tagTypes.inclusionResolver);
  }

  async getInstanceTopic(entity: DeviceType): Promise<string> {
    return Promise.resolve([this.getTopicRoot(), entity.id].join('/'));
  }

  getTopicRoot(): string {
    return 'DEVICE-TYPE';
  }

  async commit() {
    const deviceTypes = await this.find({
      include: [{relation: 'devices', scope: {include: [{relation: 'tags'}]}}],
    });

    const topicToSend = this.config.CONFIG_DEVICES_TYPES_COMMIT_TOPIC;

    (await this.mqttService()).publishMessage(
      topicToSend + '/ALL',
      Buffer.from(JSON.stringify(deviceTypes)),
    );
  }

  async initializeInstance(entityId: string): Promise<void> {
    // await this.findById(entityId);

    const devices = await this.devices(entityId).find();

    const devRepo = await this.deviceRepositoryGetter();

    for (const d of devices) {
      await devRepo.initializeInstance(d.id);
    }

    const deviceTypes = await this.find({
      where: {id: entityId},
      include: [{relation: 'devices', scope: {include: [{relation: 'tags'}]}}],
    });

    for (const devType of deviceTypes) {
      await this.sendUpdateViaMqtt(devType);
    }

    return Promise.resolve();
  }

  async sendUpdateViaMqtt(entity: DeviceType, operation = 'CREATE') {
    const deviceTypeInitTopic =
      this.config.CONFIG_TOPIC_PREFIX +
      (await this.getInstanceTopic(entity)) +
      '/' +
      this.config.CONFIG_DEVICE_TYPES_INIT_TOPIC_SUFFIX;

    (await this.mqttService()).publishMessage(
      deviceTypeInitTopic,
      Buffer.from(JSON.stringify(entity)),
    );
    return super.sendUpdateViaMqtt(entity, operation);
  }
}
