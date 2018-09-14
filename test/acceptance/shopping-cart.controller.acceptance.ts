// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createClientForHandler, supertest} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {ShoppingApplication} from '../..';
import {ShoppingCartRepository} from '../../src/repositories';
import {RedisDataSource} from '../../src/datasources';
import {ShoppingCart} from '../../src/models';

describe('ShoppingCartController', () => {
  let app: ShoppingApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;
  const cartRepo = new ShoppingCartRepository(new RedisDataSource());

  before(givenAnApplication);

  before(givenARestServer);

  before(async () => {
    await app.boot();
    await app.start();
  });

  before(() => {
    client = createClientForHandler(server.requestHandler);
  });

  beforeEach(clearDatabase);

  after(async () => {
    await app.stop();
  });

  it('sets a shopping cart for a user', async () => {
    const cart = givenShoppingCart();
    await client
      .put(`/shoppingCarts/${cart.userId}`)
      .set('Content-Type', 'application/json')
      .send(cart)
      .expect(200);
  });

  it('throws error if userId does not match the cart', async () => {
    const cart = givenShoppingCart();
    await client
      .put('/shoppingCarts/not-exist')
      .set('Content-Type', 'application/json')
      .send(cart)
      .expect(400);
  });

  it('returns a shopping cart', async () => {
    const cart = givenShoppingCart();
    await client.get(`/shoppingCarts/${cart.userId}`).expect(404);
    await client
      .put(`/shoppingCarts/${cart.userId}`)
      .send(cart)
      .expect(200);
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .expect(200, cart.toJSON());
  });

  it('deletes a shopping cart', async () => {
    const cart = givenShoppingCart();
    // Set the shopping cart
    await client
      .put(`/shoppingCarts/${cart.userId}`)
      .send(cart)
      .expect(200);
    // Now we can see it
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .expect(200, cart.toJSON());
    // Delete the shopping cart
    await client.del(`/shoppingCarts/${cart.userId}`).expect(200);
    // Now it's gone
    await client.get(`/shoppingCarts/${cart.userId}`).expect(404);
  });

  function givenAnApplication() {
    app = new ShoppingApplication({
      rest: {
        port: 0,
      },
    });
  }

  async function givenARestServer() {
    server = await app.getServer(RestServer);
  }

  async function clearDatabase() {
    await cartRepo.deleteAll();
  }

  function givenShoppingCart() {
    return new ShoppingCart({
      userId: 'user-0001',
      items: [
        {
          productId: 'iPhone XS Max',
          quantity: 1,
          price: 1200,
        },
      ],
    });
  }
});
