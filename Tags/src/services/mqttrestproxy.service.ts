//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {bind, /* inject, */ BindingScope, Getter} from '@loopback/core';
import {
  AlertRepository,
  DeviceTypeRepository,
  DeviceRepository,
  NotificationRepository,
  TagGroupRepository,
  TagRepository,
  UserRepository,
  SettingRepository,
  TagTypeRepository,
} from '../repositories';
import {repository} from '@loopback/repository';
import {TopicMapping} from '../common/mqtt-common-types';
import {MqttServiceService} from './mqtt-service.service';

@bind({scope: BindingScope.SINGLETON})
export class MqttRestProxyService {
  protected topicMappings: TopicMapping[];

  constructor(
    @repository.getter('AlertRepository')
    protected alertReporsitory: Getter<AlertRepository>,

    @repository.getter('DeviceTypeRepository')
    protected deviceTypeRepository: Getter<DeviceTypeRepository>,

    @repository.getter('DeviceRepository')
    protected deviceRepository: Getter<DeviceRepository>,

    @repository.getter('NotificationRepository')
    protected notificationRepository: Getter<NotificationRepository>,

    @repository.getter('TagGroupRepository')
    protected tagGroupRepository: Getter<TagGroupRepository>,

    @repository.getter('TagTypeRepository')
    protected tagTypeRepository: Getter<TagTypeRepository>,

    @repository.getter('TagRepository')
    protected tagRepository: Getter<TagRepository>,

    @repository.getter('UserRepository')
    protected userRepository: Getter<UserRepository>,

    @repository.getter('SettingRepository')
    protected settingRepository: Getter<SettingRepository>,
  ) {
    this.topicMappings = [];
  }

  async setup(mqttService: MqttServiceService): Promise<void> {
    this.topicMappings.push(
      (await this.alertReporsitory()).getTopicMapping(),
      (await this.deviceTypeRepository()).getTopicMapping(),
      (await this.deviceRepository()).getTopicMapping(),
      (await this.notificationRepository()).getTopicMapping(),
      (await this.tagRepository()).getTopicMapping(),
      (await this.tagTypeRepository()).getTopicMapping(),
      (await this.tagGroupRepository()).getTopicMapping(),
      (await this.settingRepository()).getTopicMapping(),
      (await this.userRepository()).getTopicMapping(),
    );

    this.topicMappings.map(topicMapping => {
      topicMapping.topics.map(async topic => {
        await mqttService.subscribeToTopic(topic);
      });
    });
    return Promise.resolve();
  }

  teardown(): void {
    this.topicMappings = [];
  }

  handleMessage(topic: string, message: string): Promise<boolean> {
    let status = true;

    const topicWithoutWildCard = topic.split('*')[0];

    this.topicMappings

      .filter(
        topicMap =>
          topicMap.topics.filter(t => t.startsWith(topicWithoutWildCard))
            .length > 0,
      )
      .map(async topicMap =>
        topicMap.repository.processMqttMessage(topic, message).catch(() => {
          status = false;
        }),
      );

    return Promise.resolve(status);
  }
}
