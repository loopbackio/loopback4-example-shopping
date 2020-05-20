// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {Suite} from 'mocha';
import {ShoppingApplication} from '../..';
import {PasswordHasherBindings} from '../../keys';
import {User} from '../../models';
import {UserRepository} from '../../repositories';
import {PasswordHasher} from '../../services/hash.password.bcryptjs';
import {setupApplication} from './helper';

describe('authorization', function (this: Suite) {
  this.timeout(5000);
  let app: ShoppingApplication;
  let client: Client;
  let userRepo: UserRepository;
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

  describe('Customer Support', () => {
    it('does not allow customer support to create orders', async () => {
      newUser = await createAUser({
        email: 'support@loopback.io',
        firstName: 'Customer',
        lastName: 'Support',
        roles: ['support'],
      });
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
        .expect(401);
    });
  });

  describe('Customer', () => {
    it('allows customer to create orders', async () => {
      newUser = await createAUser({
        email: 'customer@loopback.io',
        firstName: 'Tom',
        lastName: 'DeLonge',
        roles: ['customer'],
      });
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

    it("allows customer to deletes one's orders", async () => {
      await client
        .delete(`/users/${newUser.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200, {count: 1});
    });

    it("denies customer to deletes other's orders", async () => {
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

  async function createAUser(userData: object) {
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
