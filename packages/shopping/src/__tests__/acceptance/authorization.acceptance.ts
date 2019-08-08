// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {UserRepository, OrderRepository} from '../../repositories';
import {MongoDataSource} from '../../datasources';
import {setupApplication} from './helper';
import {PasswordHasher} from '../../services/hash.password.bcryptjs';
import {PasswordHasherBindings} from '../../keys';

describe.only('authorization', () => {
  let app: ShoppingApplication;
  let client: Client;
  const mongodbDS = new MongoDataSource();
  const orderRepo = new OrderRepository(mongodbDS);
  const userRepo = new UserRepository(mongodbDS, orderRepo);

  const user = {
    email: 'test@loopback.io',
    password: 'p4ssw0rd',
    firstName: 'customer_service',
  };

  let passwordHasher: PasswordHasher;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  before(migrateSchema);
  before(createPasswordHasher);

  beforeEach(clearDatabase);
  after(async () => {
    await app.stop();
  });
  it.only('allows bob create orders', async () => {
    const newUser = await createAUser();
    const orderObj = {
      userId: newUser.id,
      total: 123,
      products: [
        {
          productId: 'string',
          quantity: 1,
          price: 123,
        },
      ],
    };

    let res = await client
      .post('/users/login')
      .send({email: newUser.email, password: user.password})
      .expect(200);

    const token = res.body.token;

    res = await client
      .post(`/users/${newUser.id}/orders`)
      .set('Authorization', 'Bearer ' + token)
      .send(orderObj)
      .expect(200);

    const orders = res.body;
    console.log(orders);
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }

  async function migrateSchema() {
    await app.migrateSchema();
  }

  async function createAUser() {
    const encryptedPassword = await passwordHasher.hashPassword(user.password);
    const newUser = await userRepo.create(
      Object.assign({}, user, {password: encryptedPassword}),
    );
    // MongoDB returns an id object we need to convert to string
    newUser.id = newUser.id.toString();

    return newUser;
  }

  async function createPasswordHasher() {
    passwordHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
  }
});
