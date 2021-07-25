//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client, sinon, expect} from '@loopback/testlab';
import {
  setupApplication,
  givenEmptyTags,
  givenEmptyTagGroups,
  givenTagGroupWithId,
  givenTagWithId,
  givenEmptyTagTypes,
  givenDeviceTypeWithId,
  givenTagTypeWithId,
  givenEmptyDeviceTypes,
} from './test-helper';
import {MqttServiceService} from '../../services';
import {CollectConfigurationConstants} from '../../CollectConfigurationConstants';

describe('When deleting all tag groups', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;
  let config: CollectConfigurationConstants;
  // This is before setting up all the tests.
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    config = await app.get('app.config');
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('Should delete all tags', async () => {
    await client
      .delete('/tag-groups/all')
      .auth(token, {type: 'bearer'})
      .expect(204);

    await client.get('/tags/count').expect(200).expect({count: 0});
  });
});

describe('When commiting on tag', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;
  let config: CollectConfigurationConstants;
  // This is before setting up all the tests.
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    config = await app.get('app.config');
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('Should send all tag group message', async () => {
    await givenEmptyTagTypes(app);
    await givenEmptyTags(app);
    await givenEmptyTagGroups(app);
    await givenEmptyDeviceTypes(app);

    const tG1 = givenTagGroupWithId('TG1', config.rootGroupId);

    const deviceType = await givenDeviceTypeWithId('testDeviceType');
    await client
      .post('/device-types')
      .auth(token, {type: 'bearer'})
      .send(deviceType)
      .expect(200);

    const testTagTypeId = 'test-tag-type';

    const tagData = await givenTagTypeWithId(testTagTypeId, 'testDeviceType');

    await client
      .post('/tag-types')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    await client
      .post('/tag-groups')
      .auth(token, {type: 'bearer'})
      .send(tG1)
      .expect(200);

    for (let childCount = 0; childCount < 10; childCount++) {
      const childGroup = givenTagGroupWithId('TG1-' + childCount, 'TG1');
      await client
        .post('/tag-groups')
        .auth(token, {type: 'bearer'})
        .send(childGroup)
        .expect(200);

      const tagData = givenTagWithId(
        'TAG1_CHILD_OF_' + childGroup.id,
        childGroup.id,
        testTagTypeId,
      );

      await client
        .post('/tags')
        .auth(token, {type: 'bearer'})
        .send(tagData)
        .expect(200);
    }

    const resp = await client.get('/tag-groups').expect(200);

    const spyMqtt = sinon.createStubInstance(MqttServiceService);

    app.bind('service.mqtt-service').to(spyMqtt);

    const commingResp = await client
      .post('/tag-groups/commit')
      .send()
      .expect(204);
    expect(spyMqtt.publishMessage.firstCall.args[0]).to.containEql(
      config.CONFIG_TOPIC_ALL_GROUPS_SUFFIX,
    );
  });
});

describe('When one tag groups is removed', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  const tagTypeId = 'testTagType';
  const deviceTypeid = 'testDeviceTypeid';
  // This is before setting up all the tests.
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    await givenEmptyTagTypes(app);
    await givenEmptyTagTypes(app);
    await givenEmptyTags(app);
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

  it('Should delete tags belonging to that tag groups', async () => {
    givenEmptyTags(app);
    givenEmptyTagGroups(app);

    const tagGroupData = givenTagGroupWithId('TG-1', '');

    const tagData = givenTagWithId('Tag1', 'TG-1', tagTypeId, deviceTypeid);

    await client
      .post('/tag-groups')
      .auth(token, {type: 'bearer'})
      .send(tagGroupData)
      .expect(200);

    await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagData)
      .expect(200);

    const resp = await client.get('/tag-groups').expect(200);

    const firstGroupId = resp.body[0].id;

    await client
      .get('/tag-groups/' + firstGroupId + '/tags')
      .auth(token, {type: 'bearer'})
      .expect(200);

    await client
      .delete('/tag-groups/' + firstGroupId)
      .auth(token, {type: 'bearer'})
      .expect(204);

    await client
      .get('/tag-groups/' + firstGroupId + '/tags')
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect([]);
  });
});
