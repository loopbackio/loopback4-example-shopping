// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {UserRepository, OrderRepository} from '../../src/repositories';
import {MongoDataSource} from '../../src/datasources';
import {setupApplication} from './helper';
import {createRecommendationServer} from '../../recommender';
const recommendations = require('../../recommender/recommendations.json');

describe('UserController', () => {
  let app: ShoppingApplication;
  let client: Client;
  const orderRepo = new OrderRepository(new MongoDataSource());
  const userRepo = new UserRepository(new MongoDataSource(), orderRepo);

  const user = {
    email: 'test@loopback.io',
    password: 'p4ssw0rd',
    firstname: 'Example',
    surname: 'User',
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  beforeEach(clearDatabase);
  after(async () => {
    await app.stop();
  });

  it('creates new user when POST /users is invoked', async () => {
    const res = await client
      .post('/users')
      .send(user)
      .expect(200);

    // Assertions
    expect(res.body.email).to.equal('test@loopback.io');
    expect(res.body.firstname).to.equal('Example');
    expect(res.body.surname).to.equal('User');
    expect(res.body).to.have.property('id');
    expect(res.body).to.not.have.property('password');
  });

  it('throws error for POST /users with a missing email', async () => {
    const res = await client
      .post('/users')
      .send({
        password: 'p4ssw0rd',
        firstname: 'Example',
        surname: 'User',
      })
      .expect(422);

    const errorText = JSON.parse(res.error.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal('email');
  });

  it('throws error for POST /users with an invalid email', async () => {
    const res = await client
      .post('/users')
      .send({
        email: 'test@loop&back.io',
        password: 'p4ssw0rd',
        firstname: 'Example',
        surname: 'User',
      })
      .expect(422);

    expect(res.body.error.message).to.equal('invalid email');
  });

  it('throws error for POST /users with a missing password', async () => {
    const res = await client
      .post('/users')
      .send({
        email: 'test@loopback.io',
        firstname: 'Example',
        surname: 'User',
      })
      .expect(422);

    const errorText = JSON.parse(res.error.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal(
      'password',
    );
  });

  it('throws error for POST /users with a string', async () => {
    await client
      .post('/users')
      .send('hello')
      .expect(415);
  });

  it('returns a user with given id when GET /user/{id} is invoked', async () => {
    const newUser = await userRepo.create(user);
    delete newUser.password;
    delete newUser.orders;
    // MongoDB returns an id object we need to convert to string
    // since the REST API returns a string for the id property.
    newUser.id = newUser.id.toString();

    await client.get(`/users/${newUser.id}`).expect(200, newUser.toJSON());
  });

  describe('user product recommendation (service) api', () => {
    // tslint:disable-next-line:no-any
    let recommendationService: any;

    before(() => {
      recommendationService = createRecommendationServer();
      recommendationService.start();
    });

    after(() => {
      recommendationService.stop();
    });

    it('returns product recommendations for a user', async () => {
      await client.get(`/users/userid/recommend`).expect(200, recommendations);
    });
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }
});
