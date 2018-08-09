// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ShoppingApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ShoppingApplication};

export async function main(options?: ApplicationConfig) {
  const app = new ShoppingApplication(options);
  await app.boot();
  await app.start();
  return app;
}
