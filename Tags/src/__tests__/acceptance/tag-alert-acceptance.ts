//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client} from '@loopback/testlab';
import {
  setupApplication,
  givenAlertWithTagId,
  givenEmptyAlertsAndNotification,
  givenNotificationForAlert,
  givenEmptyTagGroups,
  givenEmptyTags,
  givenTagWithId,
  givenEmptyTagTypes,
  givenDeviceTypeWithId,
  givenTagTypeWithId,
} from './test-helper';

describe('When deleting tags and commiting', () => {
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

  it('Should delete alerts which belongs to tag', async () => {
    await givenEmptyAlertsAndNotification(app);
    await givenEmptyTagGroups(app);
    await givenEmptyTags(app);

    const tagData = givenTagWithId('SPIA0-0', '', tagTypeId, deviceTypeid);
    await client
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

    alertId = recievedAlert.body.id;

    const notificationForAlert = givenNotificationForAlert(alertId);

    await client
      .post('/notifications')
      .auth(token, {type: 'bearer'})
      .send(notificationForAlert)
      .expect(200);

    await client
      .delete('/tags/SPIA0-0')
      .auth(token, {type: 'bearer'})
      .expect(204);

    await client
      .post('/alerts/commit')
      .auth(token, {type: 'bearer'})
      .send()
      .expect(204);
    // await client.delete('/alerts/' + alertId).expect(204);

    await client
      .get('/alerts')
      .auth(token, {type: 'bearer'})
      .expect(200)
      .expect([]);
  });
});

// describe('When new all groups message is recieved', () => {
//   let app: CollectApplication;
//   let client: Client;
//   let token: string;

//   // This is before setting up all the tests.
//   before('setupApplication', async () => {
//     ({app, client, token} = await setupApplication(2, 3));
//   });
//   after(async () => {
//     if (app) {
//       await app.stop();
//     }
//   });

//   it('Should delete alerts which belongs to no tags', async () => {
//     await givenEmptyAlertsAndNotification(app);

//     const alertWithValidTag = givenAlertWithTagId('SPIA0-0');
//     await client
//       .post('/alerts')
//       .auth(token, {type: 'bearer'})
//       .send(alertWithValidTag)
//       .expect(200);

//     // await sendAllTagMessage(app, 1, 2, 'NEWSPIA');

//     await client
//       .get('/alerts')
//       .auth(token, {type: 'bearer'})
//       .expect(200)
//       .expect([]);
//   });
// });
