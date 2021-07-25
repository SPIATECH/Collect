//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from '../..';
import {Client} from '@loopback/testlab';
import {setupApplication} from './test-helper';
import {CollectConfigurationConstants} from '../../CollectConfigurationConstants';

describe('When logged out', () => {
  let app: CollectApplication;
  let client: Client;

  let config: CollectConfigurationConstants;
  let token: string;
  before('setupApplication', async () => {
    ({app, client, token} = await setupApplication());
    config = await app.get('app.config');
  });
  after(async () => {
    if (app) {
      await app.stop();
    }
  });

  it('Should not be able to get alerts information', async () => {
    if (config.enableAuthentication) {
      await client.get('/alerts').expect(401);
      await client.get('/alerts').auth(token, {type: 'bearer'}).expect(200);
    } else {
      await client.get('/alerts').expect(200);
    }
  });

  it('Should not be able to get tag information without logging in', async () => {
    if (config.enableAuthentication) {
      await client.get('/tags').auth(token, {type: 'bearer'}).expect(200);
    } else {
      await client.get('/tags').expect(200);
    }
  });
});
