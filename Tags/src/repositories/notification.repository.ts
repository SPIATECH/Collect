//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository, BelongsToAccessor} from '@loopback/repository';
import {Notification, NotificationRelations, Alert} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AlertRepository} from './alert.repository';
import {VersionedEntityRepository} from './versioned-entity.repository';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class NotificationRepository extends VersionedEntityRepository<
  Notification,
  typeof Notification.prototype.id,
  NotificationRelations
> {
  public readonly alert: BelongsToAccessor<
    Alert,
    typeof Notification.prototype.id
  >;

  constructor(
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @repository.getter('AlertRepository')
    protected alertRepositoryGetter: Getter<AlertRepository>,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(Notification, dataSource, mqttService, logger, config);
    this.alert = this.createBelongsToAccessorFor(
      'alert',
      alertRepositoryGetter,
    );
    this.registerInclusionResolver('alert', this.alert.inclusionResolver);
  }

  async getInstanceTopic(entity: Notification): Promise<string> {
    return Promise.resolve([this.getTopicRoot(), entity.id].join('/'));
  }

  getTopicRoot(): string {
    return 'NOTIFICATION';
  }
}
