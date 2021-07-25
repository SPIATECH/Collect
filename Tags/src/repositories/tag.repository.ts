//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  Filter,
  Options,
} from '@loopback/repository';
import {Tag, TagRelations, TagGroup, Alert, TagType, Device} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TagGroupRepository} from './tag-group.repository';
import {AlertRepository} from './alert.repository';
import {TagTypeRepository} from './tag-type.repository';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {DeviceRepository} from './device.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import {DeviceTypeRepository} from './device-type.repository';

export class TagRepository extends VersionedEntityRepository<
  Tag,
  typeof Tag.prototype.id,
  TagRelations
> {
  public readonly tagGroup: BelongsToAccessor<
    TagGroup,
    typeof Tag.prototype.id
  >;

  public readonly alerts: HasManyRepositoryFactory<
    Alert,
    typeof Tag.prototype.id
  >;

  public readonly tagType: BelongsToAccessor<TagType, typeof Tag.prototype.id>;

  public readonly device: BelongsToAccessor<Device, typeof Tag.prototype.id>;

  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @repository.getter('TagGroupRepository')
    protected tagGroupRepositoryGetter: Getter<TagGroupRepository>,
    @repository.getter('AlertRepository')
    protected alertRepositoryGetter: Getter<AlertRepository>,
    @repository.getter('TagTypeRepository')
    protected tagTypeRepositoryGetter: Getter<TagTypeRepository>,
    @repository.getter('DeviceRepository')
    protected deviceRepositoryGetter: Getter<DeviceRepository>,
    @repository.getter('DeviceTypeRepository')
    protected deviceTypeRepositoryGetter: Getter<DeviceTypeRepository>,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(Tag, dataSource, mqttService, logger, config);
    this.device = this.createBelongsToAccessorFor(
      'device',
      deviceRepositoryGetter,
    );
    this.registerInclusionResolver('device', this.device.inclusionResolver);
    this.tagType = this.createBelongsToAccessorFor(
      'tagType',
      tagTypeRepositoryGetter,
    );
    this.registerInclusionResolver('tagType', this.tagType.inclusionResolver);
    this.alerts = this.createHasManyRepositoryFactoryFor(
      'alerts',
      alertRepositoryGetter,
    );
    this.registerInclusionResolver('alerts', this.alerts.inclusionResolver);
    this.tagGroup = this.createBelongsToAccessorFor(
      'tagGroup',
      tagGroupRepositoryGetter,
    );
  }

  find(
    filter?: Filter<Tag>,
    options?: Options,
  ): Promise<(Tag & TagRelations)[]> {
    filter = {order: ['creationTimeStamp ASC'], ...filter};

    return super.find(filter, options);
  }

  async getInstanceTopic(entity: Tag): Promise<string> {
    // const devTypeId = (await this.tagType(entity.id)).deviceTypeId;

    // const deviceId = (await this.device(entity.id)).id;

    const deviceId = entity.deviceId ? entity.deviceId : 'UNIDENTIFIED_DEVICE';

    return Promise.resolve(
      ['DEVICE', deviceId, this.getTopicRoot(), entity.tagTypeId].join('/'),
    );
  }
  getTopicRoot(): string {
    return 'TAG';
  }

  async initializeInstance(entityId: string): Promise<void> {
    const entity = await this.findById(entityId);

    await this.sendUpdateViaMqtt(entity);

    return Promise.resolve();
  }

  async sendUpdateViaMqtt(entity: Tag, operation = 'CREATE') {
    const devTypeId = (await this.device(entity.id)).deviceTypeId;

    const deviceType = await (await this.deviceTypeRepositoryGetter()).findById(
      devTypeId,
    );

    if (deviceType.sendBatchUpdates) {
      const devRepo = await this.deviceRepositoryGetter();

      const device = await devRepo.findById(entity.deviceId, {
        include: [
          {
            relation: 'tags',
          },
        ],
      });

      await (await this.deviceRepositoryGetter()).sendUpdateViaMqtt(
        device,
        operation,
      );
    }

    if (deviceType.sendIndividualUpdates) {
      await super.sendUpdateViaMqtt(entity, operation);
    }
  }
}
