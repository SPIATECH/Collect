//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {Entity} from '@loopback/repository';

export interface MqttProxiedRepository {
  processMqttMessage(topic: string, message: String): Promise<boolean>;

  initializeInstance(entityId: string): Promise<void>;

  getRecieverTopics(): string[];

  getSenderTopics(): string[];

  getCreateTopic(): string;

  getUpdateTopic(): string;

  getDeleteTopic(): string;

  getStatusTopic(): string;

  getInitTopic(withWildCard: boolean): string;

  getTopicRoot(): string;

  getInstanceTopic(entity: Entity): Promise<string>;
}
