//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {CollectApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {CollectApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new CollectApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);

  return app;
}
