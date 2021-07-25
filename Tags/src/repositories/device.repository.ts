//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
  Where,
  Options,
  Count,
} from '@loopback/repository';
import {Device, DeviceRelations, Tag, Setting, DeviceType} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TagRepository} from './tag.repository';
import {SettingRepository} from './setting.repository';
import {DeviceTypeRepository} from './device-type.repository';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class DeviceRepository extends VersionedEntityRepository<
  Device,
  typeof Device.prototype.id,
  DeviceRelations
> {
  public readonly tags: HasManyRepositoryFactory<
    Tag,
    typeof Device.prototype.id
  >;

  public readonly settings: HasManyRepositoryFactory<
    Setting,
    typeof Device.prototype.id
  >;

  public readonly deviceType: BelongsToAccessor<
    DeviceType,
    typeof Device.prototype.id
  >;

  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>,
    @repository.getter('SettingRepository')
    protected settingRepositoryGetter: Getter<SettingRepository>,
    @repository.getter('DeviceTypeRepository')
    protected deviceTypeRepositoryGetter: Getter<DeviceTypeRepository>,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(Device, dataSource, mqttService, logger, config);
    this.deviceType = this.createBelongsToAccessorFor(
      'deviceType',
      deviceTypeRepositoryGetter,
    );
    this.registerInclusionResolver(
      'deviceType',
      this.deviceType.inclusionResolver,
    );

    this.settings = this.createHasManyRepositoryFactoryFor(
      'settings',
      settingRepositoryGetter,
    );
    this.registerInclusionResolver('settings', this.settings.inclusionResolver);

    this.tags = this.createHasManyRepositoryFactoryFor(
      'tags',
      tagRepositoryGetter,
    );
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
  }

  async deleteAll(where?: Where<Device>, options?: Options): Promise<Count> {
    const devicesToDelete = await this.find({where: where});

    const proms: Promise<void>[] = devicesToDelete.map(async device => {
      await this.tags(device.id).delete();
    });
    proms.map(async promise => {
      await promise;
    });

    const promToReturn = await super.deleteAll(where, options);

    return promToReturn;
  }

  async deleteById(
    id: typeof Device.prototype.id,
    options?: Options,
  ): Promise<void> {
    const promToReturn = await super.deleteById(id, options);

    await this.tags(id).delete();

    return promToReturn;
  }

  async commit() {
    const topicToSend = this.config.CONFIG_DEVICES_COMMIT_TOPIC;

    const devices: {[key: string]: (Device & DeviceRelations)[]} = {};
    (await this.find({include: [{relation: 'tags'}]})).map(
      async (item: Device & DeviceRelations) => {
        if (!Array.isArray(devices[item.deviceTypeId])) {
          devices[item.deviceTypeId] = [];
        }
        devices[item.deviceTypeId].push(item);
        return;
      },
    );

    Object.keys(devices).map(async key => {
      (await this.mqttService()).publishMessage(
        topicToSend + '/' + key,
        Buffer.from(JSON.stringify(devices[key])),
      );
      return;
    });

    (await this.mqttService()).publishMessage(
      topicToSend + '/ALL-DEVICES',
      Buffer.from(JSON.stringify(devices)),
    );
  }

  async getInstanceTopic(entity: Device): Promise<string> {
    return Promise.resolve(
      [this.getTopicRoot(), entity.deviceTypeId].join('/'),
    );
  }

  getTopicRoot(): string {
    return 'DEVICE';
  }

  async initializeInstance(entityId: string): Promise<void> {
    const entity = await this.findById(entityId);

    await this.sendUpdateViaMqtt(entity);

    const tagRepo = await this.tagRepositoryGetter();
    const tags = await this.tags(entityId).find();

    for (const t of tags) {
      await tagRepo.initializeInstance(t.id);
    }

    return Promise.resolve();
  }
}
