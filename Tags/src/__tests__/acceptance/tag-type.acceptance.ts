//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client, sinon, expect} from '@loopback/testlab';
import {
  setupApplication,
  givenEmptyTagGroups,
  givenEmptyTags,
  givenDeviceTypeWithId,
  givenEmptyDeviceTypes,
  givenEmptyTagTypes,
  givenTagTypeWithId,
  givenTagWithId,
} from './test-helper';
import {MqttServiceService} from '../../services';
import {DeviceTypeRepository, TagTypeRepository} from '../../repositories';
import {PropertyType} from '../../models';
import {PropertyValidation} from '../../models/property-validation.model';

describe('When Creating Tag Type', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;
  const testDeviceType = 'test-device-type';
  // This is before setting up all the tests.
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    await givenEmptyDeviceTypes(app);
    const deviceType = await givenDeviceTypeWithId(testDeviceType);
    await client
      .post('/device-types')
      .auth(token, {type: 'bearer'})
      .send(deviceType)
      .expect(200);
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('Should send an mqtt message to the base topic', async () => {
    await givenEmptyTagTypes(app);

    const tagTypeRepository = await app.getRepository(TagTypeRepository);

    const testTagTypeId = 'test-tag-type';

    const spyMqtt = sinon.createStubInstance(MqttServiceService);
    app.bind('service.mqtt-service').to(spyMqtt);

    const tagData = await givenTagTypeWithId(testTagTypeId, testDeviceType);

    await client
      .post('/tag-types')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    expect(spyMqtt.publishMessage.callCount).to.be.eql(1);

    const topicToPublish = await tagTypeRepository.getInstanceTopic(tagData);
    expect(spyMqtt.publishMessage.firstCall.args[0]).to.containEql(
      topicToPublish,
    );
  });
});

describe('When mqtt message is recieved on spiai4suite/TAG-TYPE/CREATE ', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;
  // This is before setting up all the tests.
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('Should create a tag type', async () => {
    await givenEmptyTagTypes(app);
    await givenEmptyDeviceTypes(app);

    const testDeviceType = '100';
    const deviceType = await givenDeviceTypeWithId(testDeviceType);

    const tagTypeId = '100';
    const tagType = await givenTagTypeWithId(tagTypeId, deviceType.id);

    const devRepo = app.getRepository(DeviceTypeRepository);

    const tagRepo = app.getRepository(TagTypeRepository);

    const devCreateTypeTopic = (await devRepo).getCreateTopic();

    const tagCreateTypeTopic = (await tagRepo).getCreateTopic();

    const mqttService: MqttServiceService = await app.get(
      'service.mqtt-service',
    );

    mqttService.onMessage(
      devCreateTypeTopic,
      Buffer.from(JSON.stringify(deviceType)),
    );

    mqttService.onMessage(
      tagCreateTypeTopic,
      Buffer.from(JSON.stringify(tagType)),
    );

    const resp = await client
      .get('/tag-types')
      .auth(token, {type: 'bearer'})
      .expect(200);

    expect(resp.body.length).equal(1);

    expect(resp.body[0].id).equal(tagType.id);
  });
});

describe('When Tag type has validation', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;

  const testDeviceType = 'awesomeDeviceType';
  const tagTypeIdWithoutRequired = 'awesomeNothingRequiredTagType';
  const tagTypeIdWithRequired = 'awesomeRequiredTagType';
  const tagTypeIdWithRequiredRegex = 'awesomeRequiredRegexTagType';
  // This is before setting up all the tests.
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());

    await givenEmptyTagTypes(app);
    await givenEmptyDeviceTypes(app);

    const deviceType = await givenDeviceTypeWithId(testDeviceType);

    const requiredProp = new PropertyType({
      name: 'requiredProperty',
      type: 'string',
      required: true,
      validations: [new PropertyValidation({validRegex: '', minLength: 1})],
      default: '',
    });
    const requiredWithRegexProp = new PropertyType({
      name: 'requiredPropertyRegex',
      type: 'string',
      required: true,
      default: '',
      validations: [
        new PropertyValidation({
          validRegex:
            '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
          minLength: 1,
        }),
      ],
    });

    const tagTypeWithoutRequired = await givenTagTypeWithId(
      tagTypeIdWithoutRequired,
      deviceType.id,
    );
    const tagTypeWithRequired = await givenTagTypeWithId(
      tagTypeIdWithRequired,
      deviceType.id,
      {
        properties: [requiredProp],
      },
    );

    const tagTypeWithRequiredRegex = await givenTagTypeWithId(
      tagTypeIdWithRequiredRegex,
      deviceType.id,
      {
        properties: [requiredWithRegexProp],
      },
    );

    const devRepo = app.getRepository(DeviceTypeRepository);

    const tagRepo = app.getRepository(TagTypeRepository);

    const devCreateTypeTopic = (await devRepo).getCreateTopic();

    const tagCreateTypeTopic = (await tagRepo).getCreateTopic();

    const mqttService: MqttServiceService = await app.get(
      'service.mqtt-service',
    );

    await mqttService.onMessage(
      devCreateTypeTopic,
      Buffer.from(JSON.stringify(deviceType)),
    );

    await mqttService.onMessage(
      tagCreateTypeTopic,
      Buffer.from(JSON.stringify(tagTypeWithoutRequired)),
    );

    await mqttService.onMessage(
      tagCreateTypeTopic,
      Buffer.from(JSON.stringify(tagTypeWithRequired)),
    );
    await mqttService.onMessage(
      tagCreateTypeTopic,
      Buffer.from(JSON.stringify(tagTypeWithRequiredRegex)),
    );
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('Should validate the tag against required properties', async () => {
    const tag = givenTagWithId('testTag', '', tagTypeIdWithRequired);

    await client
      .post('/tags')
      .send(tag)
      .auth(token, {type: 'bearer'})
      .expect(400);

    const tagWithRequired = givenTagWithId(
      'testTagRequired',
      '',
      tagTypeIdWithRequired,
      '',
      {
        requiredProperty: 'testRequired',
      },
    );
    await client
      .post('/tags')
      .send(tagWithRequired)
      .auth(token, {type: 'bearer'})
      .expect(200);
  });

  it('Should validate the tag against regex definition', async () => {});
});
