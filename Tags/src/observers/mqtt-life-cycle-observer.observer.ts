//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
  CoreBindings,
  inject,
} from '@loopback/core';
import {MqttServiceService, MqttRestProxyService} from '../services';
import {CollectApplication} from '..';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('start-services')
export class MqttLifeCycleObserverObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: CollectApplication,
    @inject('service.mqtt-service') private mqttService: MqttServiceService,
    @inject('service.mqtt-rest-service')
    private mqttRestProxyService: MqttRestProxyService,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    this.mqttService.connect();

    await this.mqttRestProxyService.setup(this.mqttService);
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    this.mqttService.disconnect();

    this.mqttRestProxyService.teardown();
  }
}
