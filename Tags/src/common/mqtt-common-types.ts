//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {MqttProxiedRepository} from './mqttproxied.repository';

export enum MqttMethod {
  GET,
  POST,
  PUT,
  DELETE,
}

export enum TopicSubscriptionStatus {
  SUBSCRIBED,
  UNSUBSCRIBED,
  ERRORSUBSCRIBING,
}

export class TopicMapping {
  public topics: string[];

  public repository: MqttProxiedRepository;

  public status: TopicSubscriptionStatus = TopicSubscriptionStatus.UNSUBSCRIBED;

  constructor(topic: string[], repository: MqttProxiedRepository) {
    this.topics = topic;
    this.repository = repository;

    this.status = TopicSubscriptionStatus.UNSUBSCRIBED;
  }
}
