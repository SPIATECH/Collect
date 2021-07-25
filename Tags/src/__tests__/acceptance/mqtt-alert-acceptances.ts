//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client, expect, sinon} from '@loopback/testlab';
import {
  setupApplication,
  givenAlertWithoutTagId,
  givenAlertWithInvalidTagId,
  givenAlertWithTagId,
  givenEmptyConfigs,
  givenEmptyAlertsAndNotification,
  givenNotificationForAlert,
  givenTagGroupWithId,
  givenTagWithId,
  givenEmptyTags,
  givenEmptyTagGroups,
  givenEmptyTagTypes,
  givenDeviceTypeWithId,
  givenTagTypeWithId,
  givenEmptyDeviceTypes,
  givenEmptyDevices,
  givenDeviceWithId,
} from './test-helper';
import {MqttServiceService} from '../../services';
import {CollectConfigurationConstants} from '../../CollectConfigurationConstants';

describe('MQTT Sending and Receiving (acceptance)', () => {
  let app: CollectApplication;
  let client: Client;
  const tagTypeId = 'testTagType';
  const deviceTypeid = 'testDeviceTypeid';
  const deviceId = 'testDeviceId-1';
  let config: CollectConfigurationConstants;
  let token: string;
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    config = await app.get('app.config');
    await givenEmptyTagTypes(app);
    await givenEmptyTagGroups(app);
    await givenEmptyTags(app);
    await givenEmptyDeviceTypes(app);
    await givenEmptyDevices(app);
    const deviceType = givenDeviceTypeWithId(deviceTypeid);
    const tagType = givenTagTypeWithId(tagTypeId, deviceTypeid);
    const device = givenDeviceWithId(deviceId, deviceTypeid);
    await client
      .post('/device-types')
      .auth(token, {type: 'bearer'})
      .send(deviceType);
    await client.post('/tag-types').auth(token, {type: 'bearer'}).send(tagType);
    await client.post('/devices').auth(token, {type: 'bearer'}).send(device);
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });
  it('Simple Heirarchy message 1 Group + 1 Tag', async () => {
    const spyMqtt = sinon.createStubInstance(MqttServiceService);
    app.bind('service.mqtt-service').to(spyMqtt);
    const testTagGroup = givenTagGroupWithId('TG-1', '');
    await client
      .post('/tag-groups')
      .auth(token, {type: 'bearer'})
      .send(testTagGroup)
      .expect(200);

    const testTag = givenTagWithId('TAG-1', 'TG-1', tagTypeId, deviceTypeid);

    await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(testTag)
      .expect(200);

    await client.post('/commit').auth(token, {type: 'bearer'}).expect(204);

    expect(spyMqtt.publishMessage.callCount).to.be.greaterThan(1);

    // spyMqtt.publishMessage.calledWith();
    // console.log(spyMqtt.publishMessage.thirdCall.args[1].toString());

    const calledTopics = spyMqtt.publishMessage
      .getCalls()
      .map(call => call.args[0]);
    expect(calledTopics).to.be.an.Array();

    const allGroupsTopic =
      config.CONFIG_TOPIC_PREFIX + config.CONFIG_TOPIC_ALL_GROUPS_SUFFIX;
    expect(calledTopics.includes(allGroupsTopic)).to.be.true();
  });

  it('Should handle 2 levels of groups', async () => {
    await givenEmptyAlertsAndNotification(app);
    await givenEmptyTags(app);
    await givenEmptyTagGroups(app);

    const spyMqtt = sinon.createStubInstance(MqttServiceService);
    app.bind('service.mqtt-service').to(spyMqtt);
    const GroupLength = 2;
    for (let grp = 0; grp < GroupLength; grp++) {
      const testTagGroup = givenTagGroupWithId('TG-' + grp, config.rootGroupId);
      await client
        .post('/tag-groups')
        .auth(token, {type: 'bearer'})
        .send(testTagGroup)
        .expect(200);

      const testTag = givenTagWithId(
        'TAG-1-' + grp,
        testTagGroup.id,
        tagTypeId,
        deviceId,
      );
      await client
        .post('/tags')
        .auth(token, {type: 'bearer'})
        .send(testTag)
        .expect(200);
    }

    await client
      .post('/tag-groups/commit')
      .auth(token, {type: 'bearer'})
      .expect(204);

    expect(spyMqtt.publishMessage.callCount).to.be.greaterThan(1);

    // const commitMessage = JSON.parse(
    //   spyMqtt.publishMessage.firstCall.args[1].toString(),
    // );
    const allGroupCalls = spyMqtt.publishMessage.getCalls().filter(call => {
      return (
        call.args[0] ===
        config.CONFIG_TOPIC_PREFIX + config.CONFIG_TOPIC_ALL_GROUPS_SUFFIX
      );
    });

    expect(allGroupCalls).to.be.an.Array();
    const allGroupMessage = JSON.parse(allGroupCalls[0].args[1].toString());
    expect(allGroupMessage.Groups.length).to.equal(GroupLength);

    expect(allGroupMessage.Groups[0].Tags.length).to.equal(1);
    expect(allGroupMessage.Groups[1].Tags.length).to.equal(1);
  });

  it('Should not be able to create alert without TagId', async () => {
    const alertWithoutTag = givenAlertWithoutTagId();
    await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithoutTag)
      .expect(404);
  });

  it('Should not be able to create alert without valid TagId', async () => {
    const alertWithoutTag = givenAlertWithInvalidTagId();
    await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithoutTag)
      .expect(404);
  });

  it('Should be able to create alert with TagId', async () => {
    const tagId = 'SPIA0-0';
    const tagData = givenTagWithId(tagId, '', tagTypeId, deviceTypeid);

    const response = await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId(tagId);
    await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    await client
      .get('/tags/' + tagId + '/alerts')
      .auth(token, {type: 'bearer'})
      .expect(200);
  });

  it('Should send a message to mqtt when calling commit in alert', async () => {
    await givenEmptyConfigs(app);
    await givenEmptyAlertsAndNotification(app);
    await givenEmptyTags(app);
    await givenEmptyTagGroups(app);

    const tagId = 'SPIA0-0';
    const tagData = givenTagWithId(tagId, '', tagTypeId, deviceTypeid);

    await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId(tagId);
    await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    const spyMqtt = sinon.createStubInstance(MqttServiceService);

    app.bind('service.mqtt-service').to(spyMqtt);

    await client
      .post('/alerts/commit')
      .auth(token, {type: 'bearer'})
      .expect(204);
    // Changed : Called thrice because we send empty config messages
    expect(spyMqtt.publishMessage.callCount).eql(4);
  });

  it('Should send two message with alert and message to mqtt when calling commit in alert', async () => {
    await givenEmptyConfigs(app);
    await givenEmptyAlertsAndNotification(app);
    await givenEmptyTags(app);
    await givenEmptyTagGroups(app);

    const tagId = 'SPIA0-0';
    const tagData = givenTagWithId(tagId, '', tagTypeId, deviceTypeid);

    await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId(tagId);
    await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    const spyMqtt = sinon.createStubInstance(MqttServiceService);

    app.bind('service.mqtt-service').to(spyMqtt);

    await client
      .post('/configs')
      .auth(token, {type: 'bearer'})
      .send({id: 'sms', data: 'testdata'})
      .expect(200);

    expect(spyMqtt.publishMessage.calledOnce).to.be.true();

    await client
      .post('/configs')
      .auth(token, {type: 'bearer'})
      .send({id: 'smtp', data: 'testdata'})
      .expect(200);

    expect(spyMqtt.publishMessage.calledTwice).to.be.true();

    await client
      .post('/alerts/commit')
      .auth(token, {type: 'bearer'})
      .expect(204);

    expect(spyMqtt.publishMessage.callCount).to.be.eql(6);
  });

  it('MQTT /Commit message to include Notification relation for alerts', async () => {
    await givenEmptyConfigs(app);
    await givenEmptyAlertsAndNotification(app);
    await givenEmptyTags(app);
    await givenEmptyTagGroups(app);

    const tagData = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);

    const tagCreated = await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    // console.log('Created Alert', recievedAlert.body.id);
    const createdAlertId = recievedAlert.body.id;

    const notificationForAlert = givenNotificationForAlert(createdAlertId);

    const createdNotification = await client
      .post('/notifications')
      .auth(token, {type: 'bearer'})
      .send(notificationForAlert)
      .expect(200);

    const createdNotificationId = createdNotification.body.id;
    const spyMqtt = sinon.createStubInstance(MqttServiceService);

    app.bind('service.mqtt-service').to(spyMqtt);

    await client
      .post('/configs')
      .auth(token, {type: 'bearer'})
      .send({id: 'sms', data: 'testdata'})
      .expect(200);

    expect(spyMqtt.publishMessage.calledOnce).to.be.true();

    await client
      .post('/configs')
      .auth(token, {type: 'bearer'})
      .send({id: 'smtp', data: 'testdata'})
      .expect(200);

    expect(spyMqtt.publishMessage.calledTwice).to.be.true();

    await client
      .post('/alerts/commit')
      .auth(token, {type: 'bearer'})
      .expect(204);

    expect(spyMqtt.publishMessage.callCount).to.be.eql(6);

    expect(
      spyMqtt.publishMessage.calledWith(config.CONFIG_ALERT_TOPIC),
    ).to.be.true();

    expect(
      spyMqtt.publishMessage.calledWith(config.CONFIG_ALERT_TOPIC_COMBINED),
    ).to.be.true();

    const commitMessage = JSON.parse(
      spyMqtt.publishMessage.thirdCall.args[1].toString(),
    );

    expect(commitMessage[0].notifications[0].id).equal(
      createdNotificationId,
      'Expecting notification is included in alert message send with QMTT Publish',
    );
  });
});
