// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ShoppingApplication} from '../../application';
import {givenHttpServerConfig} from '@loopback/testlab';

export async function setupApplication(): Promise<ShoppingApplication> {
  const app = new ShoppingApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  return app;
}
