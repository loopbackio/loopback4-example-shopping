// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {ShoppingCartRepository} from '../../repositories';
import {ShoppingCart, ShoppingCartItem} from '../../models';
import {setupApplication} from './helper';

describe('ShoppingCartController', () => {
  let app: ShoppingApplication;
  let client: Client;

  let cartRepo: ShoppingCartRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    cartRepo = await app.get('repositories.ShoppingCartRepository');
  });
  after(async () => {
    await app.stop();
  });
  beforeEach(clearDatabase);

  it('sets a shopping cart for a user', async () => {
    const cart = givenShoppingCart();
    await client
      .put(`/shoppingCarts/${cart.userId}`)
      .set('Content-Type', 'application/json')
      .send(cart)
      .expect(204);
  });

  it('throws error if userId does not match the cart', async () => {
    const cart = givenShoppingCart();
    await client
      .put('/shoppingCarts/non-existant-id')
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
      .expect(204);
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
      .expect(204);
    // Now we can see it
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .expect(200, cart.toJSON());
    // Delete the shopping cart
    await client.del(`/shoppingCarts/${cart.userId}`).expect(204);
    // Now it's gone
    await client.get(`/shoppingCarts/${cart.userId}`).expect(404);
  });

  it('adds a shopping cart item', async () => {
    const cart = givenShoppingCart();
    const newItem = givenAnItem();
    // Set the shopping cart
    await client
      .put(`/shoppingCarts/${cart.userId}`)
      .send(cart)
      .expect(204);
    // Now we can see it
    await client
      .post(`/shoppingCarts/${cart.userId}/items`)
      .send(newItem)
      .expect(200);
    const newCart = (await client
      .get(`/shoppingCarts/${cart.userId}`)
      .expect(200)).body;
    expect(newCart.items).to.containEql(newItem.toJSON());
  });

  async function clearDatabase() {
    await cartRepo.deleteAll();
  }

  function givenAnItem(item?: Partial<ShoppingCartItem>) {
    return new ShoppingCartItem(
      Object.assign(
        {
          productId: 'iPhone XS',
          quantity: 2,
          price: 2000,
        },
        item,
      ),
    );
  }

  function givenShoppingCart() {
    return new ShoppingCart({
      userId: 'user-0001',
      items: [givenAnItem()],
    });
  }
});
