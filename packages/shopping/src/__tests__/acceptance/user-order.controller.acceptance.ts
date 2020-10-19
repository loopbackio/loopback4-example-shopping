// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, supertest} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {UserWithPassword, Order, User} from '../../models';
import {OrderRepository, UserRepository} from '../../repositories';
import {UserManagementService} from '../../services';
import {setupApplication} from './helper';

describe('UserOrderController acceptance tests', () => {
  let app: ShoppingApplication;
  let client: supertest.SuperTest<supertest.Test>;
  let userManagementService: UserManagementService;

  const userData = {
    email: 'user@loopback.io',
    firstName: 'John',
    roles: ['customer'],
  };

  const userPassword = 'p4ssw0rd';

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  let userRepo: UserRepository;
  let orderRepo: OrderRepository;

  before(async () => {
    orderRepo = await app.get('repositories.OrderRepository');
    userRepo = await app.get('repositories.UserRepository');
    userManagementService = await app.get('services.user.service');
  });

  beforeEach(clearDatabase);
  after(async () => {
    await app.stop();
  });

  it('creates an order for a user with a given orderId', async () => {
    const user = await givenAUser();
    const userId = user.id;
    const fullName = getFullName(user);
    const order = givenAOrder({userId: userId, fullName, orderId: '1'});
    const token = await authenticateUser(user);

    const res = await client
      .post(`/users/${userId}/orders`)
      .set('Authorization', 'Bearer ' + token)
      .send(order)
      .expect(200);

    const body = res.body;
    // date property is set by the backend
    delete body.date;
    expect(body).to.deepEqual(order);
  });

  it('creates an order for a user without a given orderId', async () => {
    const user = await givenAUser();
    const userId = user.id;
    const fullName = getFullName(user);
    const order = givenAOrder({userId: userId, fullName});

    const token = await authenticateUser(user);

    const res = await client
      .post(`/users/${userId}/orders`)
      .set('Authorization', 'Bearer ' + token)
      .send(order)
      .expect(200);

    const body = res.body;
    expect(body.orderId).to.be.a.String();
    delete body.date;
    delete body.orderId;
    expect(body).to.deepEqual(order);
  });

  it('throws an error when a userId in path does not match body', async () => {
    const user = await givenAUser();
    const userId = user.id;
    const fullName = getFullName(user);
    const order = givenAOrder({userId: 'hello', fullName});

    const token = await authenticateUser(user);

    await client
      .post(`/users/${userId}/orders`)
      .set('Authorization', 'Bearer ' + token)
      .set('Content-Type', 'application/json')
      .send(order)
      .expect(400);
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

    beforeEach(async () => {
      await givenUserAndOrders();
      userManagementService = await app.get('services.user.service');
    });

    it('retrieves orders for a given user', async () => {
      const fullName = getFullName(user);
      const order = givenAOrder({
        userId: 'randomUserId',
        fullName,
        total: 100.99,
      });
      await orderRepo.create(order);

      const token = await authenticateUser(user);

      const expected: Partial<Order>[] = [
        savedOrder1.toJSON(),
        savedOrder2.toJSON(),
      ];
      const res = await client
        .get(`/users/${userId}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200);

      const body = res.body;
      body.forEach((o: Partial<Order>, i: number) => {
        delete o.date;
        delete expected[i].date;
        expect(o).to.deepEqual(expected[i]);
      });
    });

    it('patches all orders for a given user', async () => {
      const token = await authenticateUser(user);

      await client
        .patch(`/users/${userId}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .send({total: 9.99})
        .expect(200, {count: 2});
    });

    it('patches orders matching filter for a given user', async () => {
      const token = await authenticateUser(user);

      await client
        .patch(`/users/${userId}/orders`)
        .query({where: {total: 999.99}})
        .set('Authorization', 'Bearer ' + token)
        .send({total: 949.99})
        .expect(200, {count: 1});
    });

    it('deletes all orders for a given user', async () => {
      const token = await authenticateUser(user);

      await client
        .del(`/users/${userId}/orders`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200, {count: 2});
    });

    it('deletes orders matching filter for a given user', async () => {
      const token = await authenticateUser(user);

      await client
        .del(`/users/${userId}/orders`)
        .query({where: {total: 999.99}})
        .set('Authorization', 'Bearer ' + token)
        .expect(200, {count: 1});
    });

    async function givenUserAndOrders() {
      user = await givenAUser();
      userId = user.id;
      const fullName = getFullName(user);
      order1 = givenAOrder({userId: user.id, fullName});
      savedOrder1 = await saveOrder(user, order1);
      order2 = givenAOrder({userId: user.id, fullName});
      order2.total = 999.99;
      savedOrder2 = await saveOrder(user, order2);
    }
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
    await orderRepo.deleteAll();
  }

  async function givenAUser() {
    const userWithPassword = new UserWithPassword(userData);
    userWithPassword.password = userPassword;
    return userManagementService.createUser(userWithPassword);
  }

  async function authenticateUser(user: User) {
    const res = await client
      .post('/users/login')
      .send({email: user.email, password: userPassword});
    return res.body.token;
  }

  function givenAOrder(partial: Partial<Order> = {}) {
    return Object.assign(
      {},
      {
        userId: '',
        total: 99.99,
        products: [
          {
            productId: '1',
            name: 'iPhone X',
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
    return userRepo.orders(user.id).create(order);
  }

  function getFullName(user: User) {
    return ((user.firstName ?? '') + ' ' + (user.lastName ?? '')).trim();
  }
});
