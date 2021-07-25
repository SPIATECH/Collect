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
  givenDeviceWithId,
  givenEmptyDevices,
} from './test-helper';
import {MqttServiceService} from '../../services';
import {DeviceTypeRepository} from '../../repositories';
import {PropertyType} from '../../models';
import {PropertyValidation} from '../../models/property-validation.model';

describe('When Creating Device Type', () => {
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

  it('Should send an mqtt message to the base topic', async () => {
    await givenEmptyTagGroups(app);
    await givenEmptyTags(app);
    await givenEmptyDeviceTypes(app);
    const deviceTypeRepository = await app.getRepository(DeviceTypeRepository);
    const testDeviceType = 'test-device-type';
    const spyMqtt = sinon.createStubInstance(MqttServiceService);
    app.bind('service.mqtt-service').to(spyMqtt);
    const deviceType = await givenDeviceTypeWithId(testDeviceType);
    await client
      .post('/device-types')
      .auth(token, {type: 'bearer'})
      .send(deviceType)
      .expect(200);
    expect(spyMqtt.publishMessage.callCount).to.be.greaterThan(1);
    const topicToPublish = await deviceTypeRepository.getInstanceTopic(
      deviceType,
    );
    const publishCall = spyMqtt.publishMessage.getCalls().find(call => {
      return call.args[0] == topicToPublish;
    });
    expect(publishCall).to.be.not.null();
  });
});

describe('When mqtt message is recieved on spiai4suite/DEVICE-TYPE/CREATE ', () => {
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
  describe('Should ', () => {
    it('create a device type', async () => {
      await givenEmptyDeviceTypes(app);
      const testDeviceType = '100';
      const deviceType = await givenDeviceTypeWithId(testDeviceType);

      const devRepo = app.getRepository(DeviceTypeRepository);

      const devCreateTypeTopic = (await devRepo).getCreateTopic();

      const mqttService: MqttServiceService = await app.get(
        'service.mqtt-service',
      );

      mqttService.onMessage(
        devCreateTypeTopic,
        Buffer.from(JSON.stringify(deviceType)),
      );

      const resp = await client
        .get('/device-types')
        .auth(token, {type: 'bearer'})
        .expect(200);

      expect(resp.body.length).equal(1);

      expect(resp.body[0].id).equal(deviceType.id);
    });
  });

  describe('And when validation is set', () => {
    before('setupApplication', async () => {
      await givenEmptyDeviceTypes(app);
      await givenEmptyDevices(app);
    });
    it('Should fail when required property doesnt exist', async () => {
      const testDeviceType = 'testDeviceTypeId';

      const testProperty = new PropertyType({
        name: 'testField',
        type: 'string',
        default: '',
        required: true,
        validations: [new PropertyValidation({validRegex: '', minLength: 1})],
      });

      const deviceType = await givenDeviceTypeWithId(testDeviceType, {
        properties: [testProperty],
      });
      const devRepo = app.getRepository(DeviceTypeRepository);

      const devCreateTypeTopic = (await devRepo).getCreateTopic();

      const mqttService: MqttServiceService = await app.get(
        'service.mqtt-service',
      );

      await mqttService.onMessage(
        devCreateTypeTopic,
        Buffer.from(JSON.stringify(deviceType)),
      );

      const resp = await client
        .get('/device-types')
        .auth(token, {type: 'bearer'})
        .expect(200);

      expect(resp.body.length).equal(1);

      const device = givenDeviceWithId('testDevice', deviceType.id);
      const failedReponse = await client
        .post('/devices')
        .send(device)
        .auth(token, {type: 'bearer'})
        .expect(400);
    });

    it('Should succeed when required property exist', async () => {
      const testDeviceType = 'testDeviceTypeId';
      const deviceType = await givenDeviceTypeWithId(testDeviceType);
      const testProerty = new PropertyType({
        name: 'testField',
        type: 'string',
        default: '',
        required: true,
        validations: [new PropertyValidation({validRegex: '', minLength: 1})],
      });
      deviceType.properties = [testProerty];
      // deviceType.allowedProperties.push();
      const devRepo = app.getRepository(DeviceTypeRepository);

      const devCreateTypeTopic = (await devRepo).getCreateTopic();

      const mqttService: MqttServiceService = await app.get(
        'service.mqtt-service',
      );

      await mqttService.onMessage(
        devCreateTypeTopic,
        Buffer.from(JSON.stringify(deviceType)),
      );

      const resp = await client
        .get('/device-types')
        .auth(token, {type: 'bearer'})
        .expect(200);

      const device = givenDeviceWithId('testDevice', deviceType.id);

      device['testField'] = 'TEST REQUIRED FIELD VALUE';

      const failedReponse = await client
        .post('/devices')
        .send(device)
        .auth(token, {type: 'bearer'})
        .expect(200);
    });

    describe('Validating with regex', () => {
      before('setupApplication', async () => {
        await givenEmptyDeviceTypes(app);
        await givenEmptyDevices(app);
        const testDeviceType = 'testDeviceTypeId';
        const deviceType = await givenDeviceTypeWithId(testDeviceType);
        const testProerty = new PropertyType({
          name: 'ipaddress',
          type: 'string',
          default: '',
          required: true,
          validations: [
            new PropertyValidation({
              validRegex:
                '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
              minLength: 1,
            }),
          ],
        });
        deviceType.properties = [testProerty];

        const devRepo = app.getRepository(DeviceTypeRepository);

        const devCreateTypeTopic = (await devRepo).getCreateTopic();

        const mqttService: MqttServiceService = await app.get(
          'service.mqtt-service',
        );

        await mqttService.onMessage(
          devCreateTypeTopic,
          Buffer.from(JSON.stringify(deviceType)),
        );
      });
      it('Should fail on regex validation for ip - invalid', async () => {
        const resp = await client
          .get('/device-types')
          .auth(token, {type: 'bearer'})
          .expect(200);
        const device = givenDeviceWithId(
          'testDeviceInvalid',
          'testDeviceTypeId',
          {
            ipaddress: 'TEST REQUIRED FIELD VALUE',
          },
        );

        const failedReponse = await client
          .post('/devices')
          .send(device)
          .auth(token, {type: 'bearer'})
          .expect(400);
      });
      it('Should succeed on regex validation for ip', async () => {
        const resp = await client
          .get('/device-types')
          .auth(token, {type: 'bearer'})
          .expect(200);
        const device = givenDeviceWithId(
          'testDeviceValid',
          'testDeviceTypeId',
          {
            ipaddress: '192.168.1.1',
          },
        );

        const failedReponse = await client
          .post('/devices')
          .send(device)
          .auth(token, {type: 'bearer'})
          .expect(200);
      });
    });
  });
});
