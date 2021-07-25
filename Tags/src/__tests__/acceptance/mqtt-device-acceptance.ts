//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client, expect, sinon} from '@loopback/testlab';
import {
  setupApplication,
  givenEmptyDeviceTypes,
  givenTagWithId,
  givenEmptyTags,
  givenEmptyDevices,
  givenEmptyTagTypes,
  givenDeviceTypeWithId,
  givenTagTypeWithId,
  givenDeviceWithId,
  givenEmptyTagGroups,
} from './test-helper';
import {MqttServiceService} from '../../services';
import {CollectConfigurationConstants} from '../../CollectConfigurationConstants';
import {Device} from '../../models';

describe('Commiting should send MQTT Message for devices', () => {
  let app: CollectApplication;
  let client: Client;
  const tagTypeId = 'testTagType';
  const deviceTypeid = 'testDeviceTypeid';
  let config: CollectConfigurationConstants;
  let token: string;
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    config = await app.get('app.config');
    await givenEmptyTagTypes(app);
    await givenEmptyTagGroups(app);
    await givenEmptyTags(app);
    await givenEmptyDevices(app);
    await givenEmptyDeviceTypes(app);
    const deviceType = givenDeviceTypeWithId(deviceTypeid);
    const tagType = givenTagTypeWithId(tagTypeId, deviceTypeid);
    await client
      .post('/device-types')
      .auth(token, {type: 'bearer'})
      .send(deviceType);
    await client.post('/tag-types').auth(token, {type: 'bearer'}).send(tagType);
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });
  it('Should send mqtt message', async () => {
    const spyMqtt = sinon.createStubInstance(MqttServiceService);
    app.bind('service.mqtt-service').to(spyMqtt);
    const numberOfDevices = 5;
    const numberOfTagsPerDevice = 5;
    for (let numDevice = 0; numDevice < numberOfDevices; numDevice++) {
      const device = givenDeviceWithId('Test' + numDevice, deviceTypeid);
      await client
        .post('/devices')
        .auth(token, {type: 'bearer'})
        .send(device)
        .expect(200);
      for (let numTag = 0; numTag < numberOfTagsPerDevice; numTag++) {
        const tag = givenTagWithId(
          numDevice + '-' + numTag,
          '',
          tagTypeId,
          device.id,
        );
        await client
          .post('/tags')
          .auth(token, {type: 'bearer'})
          .send(tag)
          .expect(200);
      }
    }

    await client
      .post('/devices/commit')
      .auth(token, {type: 'bearer'})
      .expect(204);

    expect(
      spyMqtt.publishMessage.calledWith(
        config.CONFIG_DEVICES_COMMIT_TOPIC + '/' + deviceTypeid,
      ),
    ).to.be.true();
    const messageCommit = JSON.parse(
      spyMqtt.publishMessage
        .getCalls()
        .find(
          c =>
            c.args[0] ==
            config.CONFIG_DEVICES_COMMIT_TOPIC + '/' + deviceTypeid,
        )
        ?.args[1].toString() || '',
    );
    expect(messageCommit).to.be.an.Array();
    expect(messageCommit).to.be.of.length(numberOfDevices);

    messageCommit.forEach((dev: Device) => {
      expect(dev.tags).to.be.an.Array();
      expect(dev.tags).to.be.of.length(numberOfTagsPerDevice);
    });
  });
});
