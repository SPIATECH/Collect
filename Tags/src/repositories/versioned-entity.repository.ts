//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  DefaultCrudRepository,
  DataObject,
  Options,
  Entity,
} from '@loopback/repository';
import {VersionedEntity} from '../models';
import {LocalDbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MqttProxiedRepository} from '../common/mqttproxied.repository';
import {TopicMapping} from '../common/mqtt-common-types';
import {MqttServiceService, SpiaLoggerService} from '../services';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';

export class VersionedEntityRepository<
    T extends VersionedEntity,
    ID,
    Relations extends object = {}
  >
  extends DefaultCrudRepository<T, ID, Relations>
  implements MqttProxiedRepository {
  public static CREATE_TOPIC = 'CREATE';

  public static UPDATE_TOPIC = 'UPDATE';

  public static DELETE_TOPIC = 'DELETE';

  public static STATUS_TOPIC = 'STATUS';

  public static INIT_TOPIC = 'INIT';

  public static TOPIC_PREFIX = 'VERSIONED_ENTITY';

  constructor(
    entityClass: typeof VersionedEntity & {prototype: T},
    @inject('datasources.LocalDb') dataSource: LocalDbDataSource,
    @inject.getter('service.mqtt-service')
    protected mqttService: Getter<MqttServiceService>,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    @inject('app.config') protected config: CollectConfigurationConstants,
  ) {
    super(entityClass, dataSource);
  }

  /**
   * This will return the topic of the format
   *  - VERSIONED_ENTITY/CREATE
   *  - VERSIONED_ENTITY/UPDATE
   *  - VERSIONED_ENTITY/DELETE
   *  - VERSIONED_ENTITY will be changed for each entity specific root topic.
   */
  getCreateTopic(): string {
    return [this.getTopicRoot(), VersionedEntityRepository.CREATE_TOPIC].join(
      '/',
    );
  }
  getUpdateTopic(): string {
    return [this.getTopicRoot(), VersionedEntityRepository.UPDATE_TOPIC].join(
      '/',
    );
  }
  getDeleteTopic(): string {
    return [this.getTopicRoot(), VersionedEntityRepository.DELETE_TOPIC].join(
      '/',
    );
  }

  getStatusTopic(): string {
    return [this.getTopicRoot(), VersionedEntityRepository.STATUS_TOPIC].join(
      '/',
    );
  }
  /* FOR EG : DEVICE-TYPE/INIT/*
   * This should enable us to listen to wild card topic like above.
   * Means that when a driver comes back up / starts it should send
   * an init topic to topic like DEVICE-TYPE/INIT/modbus.
   * This will trigger a series of messages to be send via mqtt, so
   * that the driver will be aware of it.
   * When used for listening the parameter passed will be true,
   * when this method is called for parsing, we will use it without wildcard.
   */
  getInitTopic(withWildCard = true): string {
    let topic = [
      this.getTopicRoot(),
      VersionedEntityRepository.INIT_TOPIC,
    ].join('/');

    if (withWildCard) {
      topic += '/*';
    }

    return topic;
  }

  async getInstanceTopic(entity: Entity): Promise<string> {
    return Promise.resolve('UNIMPLEMENTED');
  }

  getTopicMapping(): TopicMapping {
    return new TopicMapping(this.getRecieverTopics(), this);
  }

  getTopicRoot(): string {
    return VersionedEntityRepository.TOPIC_PREFIX;
  }

  getRecieverTopics(): string[] {
    return [
      this.getCreateTopic(),
      this.getUpdateTopic(),
      this.getDeleteTopic(),
      this.getInitTopic(),
    ];
  }

  getSenderTopics(): string[] {
    return [this.getStatusTopic()];
  }

  async sendUpdateViaMqtt(entity: Entity, operation = 'CREATE') {
    const topic =
      this.config.CONFIG_TOPIC_PREFIX +
      (await this.getInstanceTopic(entity)) +
      '/' +
      operation.toUpperCase();

    (await this.mqttService()).publishMessage(
      topic,
      Buffer.from(JSON.stringify(entity)),
    );
  }

  async processMqttMessage(topic: string, message: string): Promise<boolean> {
    const data: VersionedEntity = JSON.parse(message);
    this.logger.debug(
      'Processing message with topic : ' + topic + ' at ' + this.getTopicRoot(),
    );
    if (topic === this.getDeleteTopic()) {
      this.logger.debug(
        'Deleting :' + this.constructor.name + ' with id : ' + data.id,
      );
      await this.deleteById(data.id);
    }
    if (topic === this.getUpdateTopic()) {
      this.logger.debug(
        'Updating :' + this.constructor.name + ' with id : ' + data.id,
      );
      this.findById(data.id)
        .then(async entity => {
          await this.updateById(data.id, data);
          (await this.mqttService()).publishMessage(
            this.getStatusTopic(),
            Buffer.from('Updated ' + this.constructor.name + ':' + data.id),
          );
        })
        .catch(async error => {
          (await this.mqttService()).publishMessage(
            this.getStatusTopic(),
            Buffer.from(
              'Failed updating ' + this.constructor.name + ':' + error,
            ),
          );
        });
    }
    if (topic === this.getCreateTopic()) {
      this.logger.debug(
        'Creating :' + this.constructor.name + ' with id : ' + data.id,
      );
      await this.create(data);
    }
    const initTopicPrefix = this.getInitTopic(false);
    if (topic.startsWith(initTopicPrefix)) {
      const entityId = topic.replace(initTopicPrefix, '');
      await this.initializeInstance(entityId);
    }
    return Promise.resolve(true);
  }
  /* This method should instance specific, for eg : a device type
   * can do initialization of all its devices / a device can send
   * all its tags etc.
   * This method should be overridden for any custom behaviour
   */
  async initializeInstance(entityId: string) {
    return Promise.resolve();
  }

  /****************************************************
  Override methods from CrudRepository
  *****************************************************/
  async replaceById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    data = {...data, ...(await this.getCreationTimeAndUpdationTime(id))};
    return super.replaceById(id, data, options);
  }

  async updateById(
    id: ID,
    data: DataObject<T>,
    options?: Options,
  ): Promise<void> {
    data = {...data, ...(await this.getCreationTimeAndUpdationTime(id))};
    const returnPromise = super.updateById(id, data, options);

    const updatedEntity = await this.findById(id);
    returnPromise
      .then(async value => this.sendUpdateViaMqtt(updatedEntity, 'UPDATED'))
      .catch(reason => {});

    return returnPromise;
  }

  async deleteById(id: ID, options?: Options): Promise<void> {
    const entityToDelete = await this.findById(id);
    const returnPromise = super.deleteById(id, options);
    returnPromise
      .then(async value => this.sendUpdateViaMqtt(entityToDelete, 'DELETED'))
      .catch(reason => {});

    return returnPromise;
  }

  async create(entity: DataObject<T>, options?: Options): Promise<T> {
    entity = {...entity, ...this.getCurrentCreationTimeAndUpdationTime()};
    const returnPromise: Promise<T> = super.create(entity, options);

    returnPromise
      .then(async value => this.sendUpdateViaMqtt(value))
      .catch(reason => {});

    return returnPromise;
  }

  async createAll(entities: DataObject<T>[], options?: Options): Promise<T[]> {
    // perform persist hook

    entities.map(e => {
      e = {...e, ...this.getCurrentCreationTimeAndUpdationTime()};
    });

    return super.createAll(entities, options);
  }

  /****************************************************
  Utility methods - Methods used by other methods,
  and these are not overrided or inherited
  *****************************************************/
  async getCreationTimeAndUpdationTime(id: ID) {
    const persistedEntity = await this.findById(id);
    if (!persistedEntity.createdOn)
      persistedEntity.createdOn = new Date().toISOString();
    persistedEntity.updatedOn = new Date().toISOString();
    return {
      createdOn: persistedEntity.createdOn,
      updatedOn: persistedEntity.updatedOn,
    };
  }
  getCurrentCreationTimeAndUpdationTime() {
    return {
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    };
  }
}
