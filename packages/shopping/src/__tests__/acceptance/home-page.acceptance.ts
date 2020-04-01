// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {setupApplication} from './helper';

describe('HomePageController', () => {
  let app: ShoppingApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    const res = await client
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
    expect(res.body).to.match(/@loopback\/example\-shopping/);
  });
});
