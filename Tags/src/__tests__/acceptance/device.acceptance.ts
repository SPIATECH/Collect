//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client, sinon, expect} from '@loopback/testlab';
import {
  setupApplication,
  givenDeviceTypeWithId,
  givenEmptyDevices,
  givenDeviceWithId,
  givenEmptyDeviceTypes,
} from './test-helper';
import {MqttServiceService} from '../../services';
import {DeviceRepository} from '../../repositories';

describe('When Creating Device', () => {
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
    await givenEmptyDevices(app);

    const deviceRepository = await app.getRepository(DeviceRepository);

    const testDeviceId = 'test-device';

    const spyMqtt = sinon.createStubInstance(MqttServiceService);
    app.bind('service.mqtt-service').to(spyMqtt);

    const deviceData = await givenDeviceWithId(testDeviceId, testDeviceType);

    await client
      .post('/devices')
      .auth(token, {type: 'bearer'})
      .send(deviceData)
      .expect(200);

    expect(spyMqtt.publishMessage.callCount).to.be.eql(1);

    const topicToPublish = await deviceRepository.getInstanceTopic(deviceData);
    expect(spyMqtt.publishMessage.firstCall.args[0]).to.containEql(
      topicToPublish,
    );
  });
});
