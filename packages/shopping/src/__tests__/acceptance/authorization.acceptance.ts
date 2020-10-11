// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {Suite} from 'mocha';
import {ShoppingApplication} from '../..';
import {UserWithPassword, User} from '../../models';
import {UserRepository} from '../../repositories';
import {setupApplication} from './helper';
import {UserManagementService} from '../../services';

describe('authorization', function (this: Suite) {
  this.timeout(5000);
  let app: ShoppingApplication;
  let client: Client;
  let userRepo: UserRepository;
  const userPassword = 'p4ssw0rd';
  let user: User;
  let token: string;
  let userManagementService: UserManagementService;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.get('repositories.UserRepository');
    userManagementService = await app.get('services.user.service');
  });
  before(migrateSchema);
  before(clearDatabase);
  after(async () => {
    if (app != null) await app.stop();
  });

  describe('Customer Support', () => {
    it('does not allow customer support to create orders', async () => {
      user = await createAUser({
        email: 'support@loopback.io',
        firstName: 'Customer',
        lastName: 'Support',
        roles: ['support'],
      });
      const orderObj = {
        userId: user.id,
        total: 123,
        products: [
          {
            productId: 'product1',
            quantity: 1,
            price: 123,
          },
        ],
      };

      const res = await client
        .post('/users/login')
        .send({email: user.email, password: userPassword})
        .expect(200);

      token = res.body.token;
      await client
        .post(`/users/${user.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .send(orderObj)
        .expect(403);
    });
  });

  describe('Customer', () => {
    it('allows customer to create orders', async () => {
      user = await createAUser({
        email: 'customer@loopback.io',
        firstName: 'Tom',
        lastName: 'DeLonge',
        roles: ['customer'],
      });
      const orderObj = {
        userId: user.id,
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
        .send({email: user.email, password: userPassword})
        .expect(200);

      token = res.body.token;

      res = await client
        .post(`/users/${user.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .send(orderObj)
        .expect(200);

      const orders = res.body;
      expect(orders).to.containDeep({
        userId: user.id,
        total: 123,
        products: [{productId: 'product2', quantity: 1, price: 123}],
      });
    });

    it("allows customer to deletes one's orders", async () => {
      await client
        .delete(`/users/${user.id}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200, {count: 1});
    });

    it("denies customer to deletes other's orders", async () => {
      await client
        .delete(`/users/${user.id + 1}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }

  async function migrateSchema() {
    await app.migrateSchema();
  }

  async function createAUser(userData: object) {
    const userWithPassword = new UserWithPassword(userData);
    userWithPassword.password = userPassword;
    return userManagementService.createUser(userWithPassword);
  }
});
