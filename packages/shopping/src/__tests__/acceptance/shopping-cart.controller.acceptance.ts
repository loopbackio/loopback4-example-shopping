// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {ShoppingCartRepository, UserRepository} from '../../repositories';
import {ShoppingCart, ShoppingCartItem, User} from '../../models';
import {setupApplication} from './helper';
import {PasswordHasherBindings} from '../../keys';

describe('ShoppingCartController', () => {
  let app: ShoppingApplication;
  let client: Client;

  let cartRepo: ShoppingCartRepository;
  let userRepo: UserRepository;

  const userData = {
    email: '',
    firstName: 'John',
    roles: ['customer'],
  };

  const userPassword = 'p4ssw0rd';

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    cartRepo = await app.get('repositories.ShoppingCartRepository');
    userRepo = await app.get('repositories.UserRepository');
  });
  after(async () => {
    await app.stop();
  });
  beforeEach(clearDatabase);

  it('protects shopping cart with authorization', async () => {
    const cart = givenShoppingCart();
    await client
      .post(`/shoppingCarts/${cart.userId}`)
      .set('Content-Type', 'application/json')
      .send(cart)
      .expect(401);
  });

  it('sets a shopping cart for a user', async () => {
    userData.email = 'userA@loopback.io';
    const user = await givenAUser();
    const token = await authenticateUser(user);
    const cart = givenShoppingCart(user.id);
    await client
      .post(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .send(cart)
      .expect(204);
  });

  it('throws error if userId does not match the cart', async () => {
    userData.email = 'userB@loopback.io';
    const user = await givenAUser();
    const token = await authenticateUser(user);
    const cart = givenShoppingCart(user.id);
    await client
      .post('/shoppingCarts/non-existant-id')
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .send(cart)
      .expect(401);
  });

  it('returns a shopping cart', async () => {
    userData.email = 'userC@loopback.io';
    const user = await givenAUser();
    const token = await authenticateUser(user);
    const cart = givenShoppingCart(user.id);
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
    await client
      .post(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(cart)
      .expect(204);
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, cart.toJSON());
  });

  it('deletes a shopping cart', async () => {
    userData.email = 'userD@loopback.io';
    const user = await givenAUser();
    const token = await authenticateUser(user);
    const cart = givenShoppingCart(user.id);
    // Set the shopping cart
    await client
      .post(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(cart)
      .expect(204);
    // Now we can see it
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, cart.toJSON());
    // Delete the shopping cart
    await client
      .del(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
    // Now it's gone
    await client
      .get(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  it('adds a shopping cart item', async () => {
    userData.email = 'userE@loopback.io';
    const user = await givenAUser();
    const token = await authenticateUser(user);
    const cart = givenShoppingCart(user.id);
    const newItem = givenAnItem();
    // Set the shopping cart
    await client
      .post(`/shoppingCarts/${cart.userId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(cart)
      .expect(204);
    // Now we can see it
    await client
      .post(`/shoppingCarts/${cart.userId}/items`)
      .set('Authorization', 'Bearer ' + token)
      .send(newItem)
      .expect(200);
    const newCart = (
      await client
        .get(`/shoppingCarts/${cart.userId}`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
    ).body;
    expect(newCart.items).to.containEql(newItem.toJSON());
  });

  async function clearDatabase() {
    await cartRepo.deleteAll();
  }

  function givenAnItem(item?: Partial<ShoppingCartItem>) {
    return new ShoppingCartItem(
      Object.assign(
        {
          productId: '0',
          name: 'iPhone XS',
          quantity: 2,
          price: 2000,
        },
        item,
      ),
    );
  }

  function givenShoppingCart(userId = '0') {
    return new ShoppingCart({
      userId: userId,
      items: [givenAnItem()],
    });
  }

  async function givenAUser() {
    const passwordHasher = await app.get(
      PasswordHasherBindings.PASSWORD_HASHER,
    );
    const encryptedPassword = await passwordHasher.hashPassword(userPassword);

    const newUser = await userRepo.create(userData);

    // MongoDB returns an id object we need to convert to string
    newUser.id = newUser.id.toString();

    await userRepo.userCredentials(newUser.id).create({
      password: encryptedPassword,
    });

    return newUser;
  }

  async function authenticateUser(user: User) {
    const res = await client
      .post('/users/login')
      .send({email: user.email, password: userPassword});

    const token = res.body.token;

    return token;
  }
});
