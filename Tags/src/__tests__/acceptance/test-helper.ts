//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {CollectConfigurationConstants} from '../../CollectConfigurationConstants';
import {Alert, Tag, TagGroup, Device, DeviceType, TagType} from '../../models';
import {Notification} from '../../models';

import {
  ConfigRepository,
  AlertRepository,
  NotificationRepository,
  TagRepository,
  TagGroupRepository,
  DeviceRepository,
  DeviceTypeRepository,
  TagTypeRepository,
} from '../../repositories';
import {MqttServiceService} from '../../services';
import {Entity, Repository, Class} from '@loopback/repository';

export async function setupApplication(
  shouldLoginWithDefaults = true,
): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new CollectApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  await givenEmptyTags(app);
  await givenEmptyTagGroups(app);
  await givenEmptyConfigs(app);
  await givenEmptyAlertsAndNotification(app);

  const client = createRestAppClient(app);

  const config: CollectConfigurationConstants = await app.get('app.config');

  let token = '';

  if (config.enableAuthentication && shouldLoginWithDefaults)
    token = await doDefaultLogin(client, config);

  return {app, client, token};
}

export async function doDefaultLogin(
  client: Client,
  config: CollectConfigurationConstants,
) {
  const email = config.defaultCreds.email;
  const password = config.defaultCreds.password;

  return loginAndGetToken(client, email, password);
}

export async function loginAndGetToken(
  client: Client,
  userEmail: string,
  userPassword: string,
): Promise<string> {
  const response = await client.post('/users/login').send({
    email: userEmail,
    password: userPassword,
  });
  let token = '';
  if (response.body && response.body.token) {
    token = response.body.token;
  }
  return token;
}

export async function makeTagsAndTagGroups(
  app: CollectApplication,
  withTagGroupsLevel: number,
  numberOfGroupsPerLevel: number,
  prefix = 'SPIA',
) {
  const config: CollectConfigurationConstants = await app.get('app.config');
  const mqttService: MqttServiceService = await app.get<MqttServiceService>(
    'service.mqtt-service',
  );

  config.sendTestGroupMessage = withTagGroupsLevel;
  config.numberOfGroupsPerLevel = numberOfGroupsPerLevel;
  config.TOPIC_SUBSCRTIPIONS = [];
}

export function givenDeviceWithId(
  deviceId: string,
  deviceTypeId: string,
  device?: Partial<Device>,
) {
  const data = Object.assign(
    {
      name: 'Device-' + deviceId,
      id: deviceId,
      deviceTypeId: deviceTypeId,
      enabled: true,
    },
    device,
  );
  return new Device(data);
}

export function givenDeviceTypeWithId(
  deviceTypeId: string,
  deviceType?: Partial<DeviceType>,
) {
  const data = Object.assign(
    {
      version: '1.Test',
      name: 'DeviceType-' + deviceTypeId,
      id: deviceTypeId,
      displayName: 'DeviceTypeWIthId-' + deviceTypeId,
      sendIndividualUpdates: true,
      sendBatchUpdates: true,
    },
    deviceType,
  );
  return new DeviceType(data);
}

export function givenTagTypeWithId(
  tagTypeId: string,
  deviceTypeId: string,
  tagType?: Partial<TagType>,
) {
  const data = Object.assign(
    {
      name: 'TagType-' + tagTypeId,
      id: tagTypeId,
      deviceTypeId: tagTypeId,
    },
    tagType,
  );
  return new TagType(data);
}

export function givenTagWithId(
  tagId: string,
  groupId: string,
  tagTypeId: string = '',
  deviceId: string = '',
  tag?: Partial<Tag>,
) {
  const data = Object.assign(
    {
      name: 'TestTag-' + tagId,
      id: tagId,
      tagTypeId: tagTypeId,
      deviceId: deviceId,
      tagGroupId: groupId,
    },
    tag,
  );
  return new Tag(data);
}

export function givenTagGroupWithId(
  tagGroupId: string,
  parentId: string,
  tagGroup?: Partial<TagGroup>,
) {
  const data = Object.assign(
    {
      name: 'TestGroup-' + tagGroupId,
      parentId: parentId,
      id: tagGroupId,
    },
    tagGroup,
  );
  return new TagGroup(data);
}

export function givenAlertWithoutTagId(alert?: Partial<Alert>) {
  const data = Object.assign(
    {
      name: 'Alert Without TagID',
      enabled: true,
    },
    alert,
  );
  return new Alert(data);
}

export function givenAlertWithTagId(tagId: string, alert?: Partial<Alert>) {
  const data = Object.assign(
    {
      name: 'Alert With TagID',
      tagId: tagId,
      enabled: true,
    },
    alert,
  );
  return new Alert(data);
}

export function givenAlertWithInvalidTagId(alert?: Partial<Alert>) {
  const data = Object.assign(
    {
      name: 'Alert With Invalid  TagID',
      tagId: 'INVALID-TAG-ID',
      enabled: true,
    },
    alert,
  );
  return new Alert(data);
}

export function givenNotificationForAlert(
  alertId: string,
  notification?: Partial<Notification>,
) {
  const data = Object.assign(
    {
      name: 'Test Notification',
      email: {reciever: 'allupaku@gmail.com'},
      sms: {},
      alertId: alertId,
      enabled: true,
    },
    notification,
  );
  return new Notification(data);
}

export function givenConfig(id: string, config?: Partial<Alert>) {
  const data = Object.assign(
    {
      id: id,
      test: 'test-data',
    },
    config,
  );
  return new Alert(data);
}

export async function givenEmptyAlertsAndNotification(app: CollectApplication) {
  await (await app.getRepository(AlertRepository)).deleteAll();
  await (await app.getRepository(NotificationRepository)).deleteAll();
}

export async function givenEmptyConfigs(app: CollectApplication) {
  await (await app.getRepository(ConfigRepository)).deleteAll();
}

export async function givenEmptyTags(app: CollectApplication) {
  await (await app.getRepository(TagRepository)).deleteAll();
}

export async function givenEmptyDevices(app: CollectApplication) {
  await (await app.getRepository(DeviceRepository)).deleteAll();
}

export async function givenEmptyDeviceTypes(app: CollectApplication) {
  await (await app.getRepository(DeviceTypeRepository)).deleteAll();
}

export async function givenEmptyTagTypes(app: CollectApplication) {
  await (await app.getRepository(TagTypeRepository)).deleteAll();
}

export async function givenEmptyAlerts(app: CollectApplication) {
  await (await app.getRepository(AlertRepository)).deleteAll();
}

export async function givenEmptyNotifications(app: CollectApplication) {
  await (await app.getRepository(NotificationRepository)).deleteAll();
}

export async function givenEmptyTagGroups(app: CollectApplication) {
  await (await app.getRepository(TagGroupRepository)).deleteAll();
}
export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms)).catch(err => {});
}

export interface AppWithClient {
  app: CollectApplication;
  client: Client;
  token: string;
}
