//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  EntityNotFoundError,
  Where,
  Options,
  Count,
} from '@loopback/repository';
import {Alert, AlertRelations, Tag, Notification} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TagRepository} from './tag.repository';
import {NotificationRepository} from './notification.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import {ConfigRepository} from './config.repository';
import legacy from 'loopback-datasource-juggler';
import {VersionedEntityRepository} from './versioned-entity.repository';
export class AlertRepository extends VersionedEntityRepository<
  Alert,
  typeof Alert.prototype.id,
  AlertRelations
> {
  public readonly tag: BelongsToAccessor<Tag, typeof Alert.prototype.id>;

  public readonly notifications: HasManyRepositoryFactory<
    Notification,
    typeof Alert.prototype.id
  >;

  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>,
    @repository.getter('NotificationRepository')
    protected notificationRepositoryGetter: Getter<NotificationRepository>,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    // not to confuse with the config object.
    @inject('app.config') private configuration: CollectConfigurationConstants,
    @repository('ConfigRepository')
    protected configRepository: ConfigRepository,
    // @repository('TagRepository') protected tagRepository: TagRepository,
    @inject('spia-logger') protected logger: SpiaLoggerService,
  ) {
    super(Alert, dataSource, mqttService, logger, configuration);
    this.notifications = this.createHasManyRepositoryFactoryFor(
      'notifications',
      notificationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'notifications',
      this.notifications.inclusionResolver,
    );
    this.tag = this.createBelongsToAccessorFor('tag', tagRepositoryGetter);
    this.registerInclusionResolver('tag', this.tag.inclusionResolver);
  }
  async deleteAll(where?: Where<Alert>, options?: Options): Promise<Count> {
    const alertsToDelete = await this.find({where: where});

    const proms: Promise<void>[] = alertsToDelete.map(async alert => {
      await this.notifications(alert.id).delete();
    });
    proms.map(async promise => {
      await promise;
    });

    const promToReturn = await super.deleteAll(where, options);

    return promToReturn;
  }

  async deleteById(
    id: typeof Alert.prototype.id,
    options?: Options,
  ): Promise<void> {
    const promToReturn = await super.deleteById(id, options);

    await this.notifications(id).delete();

    return promToReturn;
  }

  /**
   *
   * @param alert
   */
  protected async entityToData(
    alert: Alert,
  ): Promise<legacy.ModelData<legacy.PersistedModel>> {
    const tagId = alert.tagId;
    if (!tagId || tagId === undefined) {
      throw new EntityNotFoundError(Tag, '');
    }

    const tagRepo: TagRepository = await this.tagRepositoryGetter();

    const validTag: Tag = await tagRepo.findById(tagId);

    if (validTag) {
      return super.entityToData(alert);
    } else {
      throw new EntityNotFoundError(Tag, tagId);
    }
  }

  async commit() {
    await this.cleanup();

    const data = await this.find({include: [{relation: 'notifications'}]});

    (await this.mqttService()).publishMessage(
      this.configuration.CONFIG_ALERT_TOPIC,
      Buffer.from(JSON.stringify(data), 'utf8'),
    );

    const messageToSend = {
      alertconfig: data,
      ...(await this.configRepository.getCommitMessages()),
    };

    await this.configRepository.commitConfigs();

    (await this.mqttService()).publishMessage(
      this.configuration.CONFIG_ALERT_TOPIC_COMBINED,
      Buffer.from(JSON.stringify(messageToSend), 'utf8'),
    );
  }

  async cleanup() {
    const alerts = await this.find();

    const tagRepo = await this.tagRepositoryGetter();

    alerts.forEach(alert => {
      tagRepo.findById(alert.tagId).catch(() => {
        this.deleteById(alert.id)
          .then(() => {
            this.logger.debug(
              'Deleted Alert becuase Tag Doesnt exist: ' + alert.id,
            );
          })
          .catch(() => {});
      });
    });
  }

  async getInstanceTopic(entity: Alert): Promise<string> {
    return Promise.resolve([this.getTopicRoot(), entity.id].join('/'));
  }

  getTopicRoot(): string {
    return 'ALERT';
  }
}
