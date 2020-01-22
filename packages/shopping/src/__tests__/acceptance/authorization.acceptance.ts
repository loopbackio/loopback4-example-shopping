// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {UserRepository} from '../../repositories';
import {setupApplication} from './helper';
import {PasswordHasher} from '../../services/hash.password.bcryptjs';
import {PasswordHasherBindings} from '../../keys';
import {User} from '../../models';

describe('authorization', () => {
  let app: ShoppingApplication;
  let client: Client;
  let userRepo: UserRepository;

  let userData = {
    email: 'testAuthor@loopback.io',
    firstName: 'customer_service',
  };

  const userPassword = 'p4ssw0rd';

  let passwordHasher: PasswordHasher;
  let newUser: User;
  let token: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.get('repositories.UserRepository');
  });
  before(migrateSchema);
  before(createPasswordHasher);
  before(clearDatabase);
  after(async () => {
    if (app != null) await app.stop();
  });

  describe('customer_service', () => {
    it('allows customer_service create orders', async () => {
      newUser = await createAUser();
      const orderObj = {
        userId: newUser.id,
        total: 123,
        products: [
          {
            productId: 'product1',
            quantity: 1,
            price: 123,
          },
        ],
      };

      let res = await client
        .post('/users/login')
        .send({email: newUser.email, password: userPassword})
        .expect(200);

      token = res.body.token;
      res = await client
        .post(`/users/${newUser.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .send(orderObj)
        .expect(200);

      const orders = res.body;
      expect(orders).to.containDeep({
        userId: newUser.id,
        total: 123,
        products: [{productId: 'product1', quantity: 1, price: 123}],
      });
    });

    it('allows customer_service delete orders', async () => {
      await client
        .delete(`/users/${newUser.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200, {count: 1});
    });
  });

  describe('bob', () => {
    it('allows bob create orders', async () => {
      userData = {
        email: 'test2@loopback.io',
        firstName: 'bob',
      };
      newUser = await createAUser();
      const orderObj = {
        userId: newUser.id,
        total: 123,
        products: [
          {
            productId: 'product2',
            quantity: 1,
            price: 123,
          },
        ],
      };

      let res = await client
        .post('/users/login')
        .send({email: newUser.email, password: userPassword})
        .expect(200);

      token = res.body.token;

      res = await client
        .post(`/users/${newUser.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .send(orderObj)
        .expect(200);

      const orders = res.body;
      expect(orders).to.containDeep({
        userId: newUser.id,
        total: 123,
        products: [{productId: 'product2', quantity: 1, price: 123}],
      });
    });

    it("allows bob deletes bob's orders", async () => {
      await client
        .delete(`/users/${newUser.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200, {count: 1});
    });

    it("denies bob deletes alice's orders", async () => {
      await client
        .delete(`/users/${newUser.id + 1}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(401);
    });
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }

  async function migrateSchema() {
    await app.migrateSchema();
  }

  async function createAUser() {
    const encryptedPassword = await passwordHasher.hashPassword(userPassword);
    const aUser = await userRepo.create(userData);

    // MongoDB returns an id object we need to convert to string
    aUser.id = aUser.id.toString();

    await userRepo.userCredentials(aUser.id).create({
      password: encryptedPassword,
    });
    return aUser;
  }

  async function createPasswordHasher() {
    passwordHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
  }
});
