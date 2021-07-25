//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';
import {LiveCheck, ReadyCheck, HealthTags} from '@loopback/extension-health';

// import * as mqtt from 'mqtt';
import {
  Client,
  connect,
  IConnackPacket,
  IClientPublishOptions,
  QoS,
} from 'mqtt';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import {SpiaLoggerService} from './spia-logger.service';
import {MqttRestProxyService} from './mqttrestproxy.service';
import {CollectApplication} from '..';

@bind({scope: BindingScope.SINGLETON})
export class MqttServiceService {
  public client: Client;

  public connected = false;

  protected ready: boolean;

  protected failureReason = '';

  protected clientPublishOptions: IClientPublishOptions = {qos: 1};

  topicsToSubscribe: string[];

  constructor(
    @inject('app.config') private config: CollectConfigurationConstants,
    @inject('spia-logger') protected logger: SpiaLoggerService,
    // @inject('service.allgroups-message-parser')
    // protected allGroupsMessageParser: AllGroupsMessageParserService,
    @inject('app') protected app: CollectApplication,
    @inject('service.mqtt-rest-service')
    protected mqttRestProxy: MqttRestProxyService,
  ) {
    this.app
      .bind('health.MqttHealth')
      .to(this.getConnectedPromise())
      .tag(HealthTags.LIVE_CHECK);
    this.app
      .bind('health.MqttReady')
      .to(this.getReadyPromise())
      .tag(HealthTags.LIVE_CHECK);
  }
  /**
   * This is for the readiness checker.
   */
  getReadyPromise(): ReadyCheck {
    const isReadyPromise: ReadyCheck = () => {
      if (this.ready) {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    };
    return isReadyPromise;
  }

  getConnectedPromise(): LiveCheck {
    const isConnectedPromise: LiveCheck = () => {
      if (this.isConnected()) {
        return Promise.resolve();
      } else {
        return Promise.reject(this.failureReason);
      }
    };

    return isConnectedPromise;
  }

  getConnectionAuthenticationOptions() {
    const authenticationOptions = {
      username: this.config.mqttconfig.username,
      password: this.config.mqttconfig.password,
    };

    return authenticationOptions;
  }

  connectWithAuthentication() {
    this.client = connect('mqtt://' + this.config.mqttconfig.broker, {
      ...this.config.mqttconfig.clientOptions,
      ...this.getConnectionAuthenticationOptions(),
    });
  }

  connectWithoutAuthentication() {
    this.client = connect(
      'mqtt://' + this.config.mqttconfig.broker,
      this.config.mqttconfig.clientOptions,
    );
  }

  handleClientError() {
    this.client.on('error', err => {
      this.logger.log('Mqtt Connection Error');
      this.logger.error(err.message);
      this.failureReason = err.message;
      this.client.end();
    });
  }

  handleConnection() {
    this.client.on('connect', (packet: IConnackPacket) => {
      this.logger.debug('Connected to Mqtt - Executing onConnect');
      this.onConnect(packet);
    });
  }

  handleConnectionClose() {
    this.client.on('close', (packet: IConnackPacket) => {
      this.disconnect();
    });
  }

  handleMessage() {
    this.client.on('message', (topic: string, payload: Buffer) => {
      this.logger.debug('Message Recieved on topic:' + topic);
      this.logger.debug('==PAYLOAD==>');
      this.logger.debug(payload.toString());
      this.logger.debug('<==PAYLOAD==');

      let topicWithoutPrefix: string = topic;

      if (topic.startsWith(this.config.CONFIG_TOPIC_PREFIX)) {
        topicWithoutPrefix = topic.replace(this.config.CONFIG_TOPIC_PREFIX, '');

        this.onMessage(topicWithoutPrefix, payload)
          .then(() => {
            this.logger.debug('<== Message Processed ==>');
          })
          .catch(() => {
            this.logger.debug('<== Message Ignored ==>');
          });
      } else {
        this.logger.debug(
          '<== Message Ignored : Doesnt have valid prefix : ' +
            this.config.CONFIG_TOPIC_PREFIX +
            ' ==>',
        );
      }
    });
  }

  connect() {
    try {
      this.logger.debug('Connecting to mqtt');

      if (this.config.mqttconfig.authenticationEnabled) {
        this.connectWithAuthentication();
      } else {
        this.connectWithoutAuthentication();
      }

      this.handleClientError();

      this.handleConnection();

      this.handleConnectionClose();

      this.handleMessage();
    } catch (Error) {
      this.logger.error(Error.message);
    }
  }

  onConnect(packet: IConnackPacket) {
    this.logger.log('Connected , start subscribing');

    this.logger.debug(JSON.stringify(packet));

    this.connected = true;

    this.config.TOPIC_SUBSCRTIPIONS.forEach(
      topicToSubscribe => {
        this.client.subscribe(topicToSubscribe, {qos: 2}, (err, granted) => {
          this.logger.log('Subscribed to topic: ' + JSON.stringify(granted));
        });
      }, // forEach ends
    );

    this.ready = true;
  }

  async subscribeToTopic(topic: string) {
    const topicToSubscribe = this.config.CONFIG_TOPIC_PREFIX + topic;

    this.config.TOPIC_SUBSCRTIPIONS.push(topicToSubscribe);

    if (this.connected) {
      this.client.subscribe(
        this.config.CONFIG_TOPIC_PREFIX + topic,
        {qos: 2},
        (err, granted) => {
          this.logger.log('Subscribed to topic: ' + JSON.stringify(granted));
        },
      );
    }
    return true;
  }

  /**
   *
   * @param topic - already prefix is removed from this topic.
   * @param payload
   */
  async onMessage(topic: string, payload: Buffer) {
    this.logger.log('Message Recieved on topic ' + topic + ' \r\n');

    this.ready = false;

    if (topic === this.config.CONFIG_TOPIC_ALL_GROUPS_SUFFIX) {
      console.log('Not tag groups!');
    } else {
      await this.mqttRestProxy.handleMessage(topic, payload.toString());
      this.logger.log('handling ' + topic);
    }

    this.ready = true;
  }

  publishMessage(topic: string, payload: Buffer, qos: QoS = 1, retain = false) {
    if (!this.client.connected) {
      this.logger.log(
        'Cannot send message to topic: ' + topic + ' as mqtt not connected.',
      );
      return;
    }
    if (this.config.retainedMessages.indexOf(topic) >= 0) {
      retain = true;
    }
    if (this.client !== undefined && this.client) {
      this.client.publish(topic, payload, {qos: qos, retain: retain});
      this.logger.debug('Sending Message To Topic: ' + topic);
      this.logger.debug('With Content : \r\n' + payload.toString());
      this.logger.debug('\r\n End Content : \r\n');
    } else {
      this.logger.debug(
        'Cannot send message to topic: ' +
          topic +
          ' as we dont have valid mqtt connection yet.',
      );
      this.logger.debug(
        'Please check the /ready to see if the server is ready to process further request.',
      );
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect() {
    this.logger.debug('Disconnect called');
    if (this.client !== undefined && this.client) this.client.end();
    this.ready = false;
    this.logger.debug(
      'Will reconnect after ' +
        this.config.mqttconfig.clientOptions.reconnectPeriod +
        'millis',
    );
    setTimeout(() => {
      this.connect();
    }, this.config.mqttconfig.clientOptions.reconnectPeriod);
  }
}
