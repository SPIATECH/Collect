//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client, expect} from '@loopback/testlab';

import {
  setupApplication,
  givenAlertWithTagId,
  givenEmptyAlertsAndNotification,
  givenNotificationForAlert,
  givenTagWithId,
  givenEmptyDevices,
  givenEmptyTagTypes,
  givenEmptyTags,
  givenTagTypeWithId,
  givenDeviceWithId,
  givenDeviceTypeWithId,
} from './test-helper';

describe('When creating alerts', () => {
  let app: CollectApplication;
  let client: Client;

  let token: string;
  let alertId: string;
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

  it('Should add creation and updation  time stamp', async () => {
    await givenEmptyAlertsAndNotification(app);

    const tagData = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);
    await client.post('/tags').auth(token, {type: 'bearer'}).send(tagData);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');

    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    expect(recievedAlert.body).hasOwnProperty('createdOn');

    expect(recievedAlert.body).hasOwnProperty('updatedOn');

    expect(recievedAlert.body.creationTimeStamp).not.null();
  });
});

describe('When updating alerts', () => {
  let app: CollectApplication;
  let client: Client;

  let token: string;
  let alertId: string;
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

  it('Should change updation time stamp', async () => {
    await givenEmptyAlertsAndNotification(app);

    const tagData = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);
    await client.post('/tags').auth(token, {type: 'bearer'}).send(tagData);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    expect(recievedAlert.body).hasOwnProperty('createdOn');

    expect(recievedAlert.body).hasOwnProperty('updatedOn');

    expect(recievedAlert.body.createdOn).not.null();

    expect(recievedAlert.body.updatedOn).not.null();

    const previousCreationTime = recievedAlert.body.createdOn;
    const previousUpdationTime = recievedAlert.body.updatedOn;

    const changedAlert = {...recievedAlert.body, metadata: {changed: 'true'}};

    await client
      .put('/alerts/' + changedAlert.id)
      .auth(token, {type: 'bearer'})
      .send(changedAlert)
      .expect(204);
    const changedAlertResponse = await client
      .get('/alerts/' + changedAlert.id)
      .auth(token, {type: 'bearer'})
      .expect(200);

    expect(changedAlertResponse.body.createdOn).equal(previousCreationTime);

    expect(changedAlertResponse.body.updatedOn).not.equal(previousUpdationTime);
  });
});

describe('When creating notifications', () => {
  let app: CollectApplication;
  let client: Client;

  let token: string;
  let alertId: string;
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

  it('Should add creation and updation  time stamp', async () => {
    await givenEmptyAlertsAndNotification(app);

    const tagData = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);
    await client.post('/tags').auth(token, {type: 'bearer'}).send(tagData);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    const alertId = recievedAlert.body.id;

    const notificationForAlert = givenNotificationForAlert(alertId);
    const notificationCreated = await client
      .post('/notifications')
      .set('Authorization', 'Bearer ' + token)
      .send(notificationForAlert)
      .expect(200);

    expect(notificationCreated.body.createdOn).not.null();
    expect(notificationCreated.body.updatedOn).not.null();

    const previousCreationTime = notificationCreated.body.createdOn;
    const previousUpdationTime = notificationCreated.body.updatedOn;

    const changedNotification = {
      ...notificationCreated.body,
      metadata: {changed: 'true'},
    };

    await client
      .put('/notifications/' + changedNotification.id)
      .auth(token, {type: 'bearer'})
      .send(changedNotification)
      .expect(204);
    const changedNotificationResponse = await client
      .get('/notifications/' + changedNotification.id)
      .auth(token, {type: 'bearer'})
      .expect(200);

    expect(changedNotificationResponse.body.createdOn).equal(
      previousCreationTime,
    );

    expect(changedNotificationResponse.body.updatedOn).not.equal(
      previousUpdationTime,
    );
  });
});

describe('When deleting alerts', () => {
  let app: CollectApplication;
  let client: Client;
  const tagTypeId = 'testTagType';
  const deviceTypeid = 'testDeviceTypeid';
  let token: string;
  let alertId: string;
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

  it('Should delete notification which belongs to alert', async () => {
    await givenEmptyAlertsAndNotification(app);

    const tagWithId = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);

    const recievedTag = await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagWithId)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    alertId = recievedAlert.body.id;

    // add 10 notifications
    const notificationsCreated: string[] = [];
    for (let i = 0; i < 10; i++) {
      const notificationForAlert = givenNotificationForAlert(alertId);
      const notif = await client
        .post('/notifications')
        .set('Authorization', 'Bearer ' + token)
        .send(notificationForAlert)
        .expect(200);
      notificationsCreated.push(notif.body.id);
    }

    await client
      .delete('/alerts/' + alertId)
      .auth(token, {type: 'bearer'})
      .expect(204);
    // Testing that notifications created above are also deleted.
    for (const notif of notificationsCreated) {
      await client
        .get('/notifications/' + notif)
        .auth(token, {type: 'bearer'})
        .expect(404);
    }
  });
});

describe('When calling DELETE /alerts/all', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;
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

  it('Should delete all alerts', async () => {
    await givenEmptyAlertsAndNotification(app);

    const tagWithId = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);

    const recievedTag = await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagWithId)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    alertId = recievedAlert.body.id;

    // add 10 notifications
    const notificationsCreated: string[] = [];
    for (let i = 0; i < 10; i++) {
      const notificationForAlert = givenNotificationForAlert(alertId);
      const notif = await client
        .post('/notifications')
        .auth(token, {type: 'bearer'})
        .send(notificationForAlert)
        .expect(200);
      notificationsCreated.push(notif.body.id);
    }

    await client
      .delete('/alerts/all')
      .auth(token, {type: 'bearer'})
      .expect(204);

    await client
      .get('/alerts')
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect([]);

    await client
      .get('/notifications')
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect([]);

    await client
      .delete('/notifications/all')
      .auth(token, {type: 'bearer'})
      .expect(204);

    await client
      .get('/notifications')
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect([]);
  });
});

describe('When calling DELETE /notifications/all', () => {
  let app: CollectApplication;
  let client: Client;
  let token: string;
  let alertId: string;
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

  it('Should delete all alerts', async () => {
    await givenEmptyAlertsAndNotification(app);

    const tagWithId = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);

    const recievedTag = await client
      .post('/tags')
      .auth(token, {type: 'bearer'})
      .send(tagWithId)
      .expect(200);

    const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
    const recievedAlert = await client
      .post('/alerts')
      .auth(token, {type: 'bearer'})
      .send(alertWithValidTag)
      .expect(200);

    alertId = recievedAlert.body.id;

    // add 10 notifications
    const notificationsCreated: string[] = [];
    for (let i = 0; i < 10; i++) {
      const notificationForAlert = givenNotificationForAlert(alertId);
      const notif = await client
        .post('/notifications')
        .auth(token, {type: 'bearer'})
        .send(notificationForAlert)
        .expect(200);
      notificationsCreated.push(notif.body.id);
    }

    await client
      .delete('/notifications/all')
      .auth(token, {type: 'bearer'})
      .expect(204);

    await client
      .get('/notifications')
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect([]);
  });
});
