// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {supertest, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {OrderRepository, UserRepository} from '../../repositories';
import {MongoDataSource} from '../../datasources';
import {User, Order} from '../../models';
import {setupApplication} from './helper';
import {JWTAuthenticationService} from '../../services/JWT.authentication.service';
import {PasswordHasherBindings, JWTAuthenticationBindings} from '../../keys';

describe('UserOrderController acceptance tests', () => {
  let app: ShoppingApplication;
  let client: supertest.SuperTest<supertest.Test>;
  const mongodbDS = new MongoDataSource();
  const orderRepo = new OrderRepository(mongodbDS);
  const userRepo = new UserRepository(mongodbDS, orderRepo);

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  beforeEach(clearDatabase);
  after(async () => {
    await app.stop();
  });

  describe('Creating new orders for authenticated users', () => {
    let plainPassword: string;
    let jwtAuthService: JWTAuthenticationService;

    const user = {
      email: 'loopback@example.com',
      password: 'p4ssw0rd',
      firstname: 'Example',
      surname: 'User',
    };

    before('create new user for user orders', async () => {
      app.bind(PasswordHasherBindings.ROUNDS).to(4);

      const passwordHasher = await app.get(
        PasswordHasherBindings.PASSWORD_HASHER,
      );
      plainPassword = user.password;
      user.password = await passwordHasher.hashPassword(user.password);
      jwtAuthService = await app.get(JWTAuthenticationBindings.SERVICE);
    });

    it('creates an order for a user with a given orderId', async () => {
      const newUser = await userRepo.create(user);
      const userId = newUser.id.toString();
      const order = givenAOrder({userId: userId, orderId: '1'});

      const token = await jwtAuthService.getAccessTokenForUser({
        email: newUser.email,
        password: plainPassword,
      });

      await client
        .post(`/users/${userId}/orders`)
        .send(order)
        .set('Authorization', 'Bearer ' + token)
        .expect(200, order);
    });

    it('creates an order for a user without a given orderId', async () => {
      const newUser = await userRepo.create(user);
      const userId = newUser.id.toString();

      const token = await jwtAuthService.getAccessTokenForUser({
        email: newUser.email,
        password: plainPassword,
      });

      const order = givenAOrder({userId: userId});

      const res = await client
        .post(`/users/${userId}/orders`)
        .send(order)
        .set('Authorization', 'Bearer ' + token)
        .expect(200);

      expect(res.body.orderId).to.be.a.String();
      delete res.body.orderId;
      expect(res.body).to.deepEqual(order);
    });

    it('throws an error when a userId in path does not match body', async () => {
      const newUser = await userRepo.create(user);
      const userId = newUser.id.toString();

      const token = await jwtAuthService.getAccessTokenForUser({
        email: newUser.email,
        password: plainPassword,
      });

      const order = givenAOrder({userId: 'hello'});

      await client
        .post(`/users/${userId}/orders`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .send(order)
        .expect(400);
    });

    it('throws an error when a user is not authenticated', async () => {
      const newUser = await userRepo.create(user);
      const userId = newUser.id.toString();

      const order = givenAOrder({userId: userId});

      await client
        .post(`/users/${userId}/orders`)
        .send(order)
        .expect(401);
    });

    it('throws an error when a user with wrong token is provided', async () => {
      const newUser = await userRepo.create(user);
      const userId = newUser.id.toString();

      const order = givenAOrder({userId: userId});

      await client
        .post(`/users/${userId}/orders`)
        .send(order)
        .set(
          'Authorization',
          'Bearer ' + 'Wrong token - IjoidGVzdEBsb29wYmFjay5p',
        )
        .expect(401);
    });
  });

  // TODO(virkt25): Implement after issue below is fixed.
  // https://github.com/strongloop/loopback-next/issues/1718
  it.skip('throws an error when creating an order for a non-existent user');

  describe('with multiple orders', () => {
    let user: User;
    let userId: string;
    let order1: Partial<Order>;
    let order2: Partial<Order>;
    let savedOrder1: Order;
    let savedOrder2: Order;

    beforeEach(givenUserAndOrders);

    it('retrieves orders for a given user', async () => {
      const order = givenAOrder({userId: 'randomUserId', total: 100.99});
      await orderRepo.create(order);

      const expected = [savedOrder1.toJSON(), savedOrder2.toJSON()];
      await client.get(`/users/${userId}/orders`).expect(200, expected);
    });

    it('patches all orders for a given user', async () => {
      await client
        .patch(`/users/${userId}/orders`)
        .send({total: 9.99})
        .expect(200, {count: 2});
    });

    // TODO(virkt25): Implement after issue below is fixed.
    // https://github.com/strongloop/loopback-next/issues/100
    it.skip('patches orders matching filter for a given user');

    it('deletes all orders for a given user', async () => {
      await client.del(`/users/${userId}/orders`).expect(200, {count: 2});
    });

    // TODO(virkt25): Implement after issue below is fixed.
    // https://github.com/strongloop/loopback-next/issues/100
    it.skip('deletes orders matching filter for a given user');

    async function givenUserAndOrders() {
      user = await givenAUser();
      userId = user.id.toString();
      order1 = givenAOrder();
      savedOrder1 = await saveOrder(user, order1);
      order2 = givenAOrder();
      order2.total = 999.99;
      savedOrder2 = await saveOrder(user, order2);
    }
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
    await orderRepo.deleteAll();
  }

  async function givenAUser() {
    const user = {
      email: 'loopback@example.com',
      password: 'p4ssw0rd',
      firstname: 'Example',
      surname: 'User',
    };
    return await userRepo.create(user);
  }

  function givenAOrder(partial: Partial<Order> = {}) {
    return Object.assign(
      {},
      {
        userId: '',
        total: 99.99,
        products: [
          {
            productId: 'product1',
            quantity: 10,
            price: 9.99,
          },
        ],
      },
      partial,
    );
  }

  async function saveOrder(user: User, order: Partial<Order>) {
    delete order.userId;
    return await userRepo.orders(user.id).create(order);
  }
});
