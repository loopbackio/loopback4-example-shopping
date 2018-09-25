// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createRestAppClient, Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';

describe('HomePageController', () => {
  let app: ShoppingApplication;
  let client: Client;

  before(givenAnApplication);

  before(async () => {
    await app.boot();
    await app.start();
  });

  before(() => {
    client = createRestAppClient(app);
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

  function givenAnApplication() {
    app = new ShoppingApplication({
      rest: {
        port: 0,
      },
    });
  }
});
