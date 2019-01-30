// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect, toJSON} from '@loopback/testlab';
import {Response} from 'superagent';
import {ShoppingApplication} from '../..';
import {UserRepository, OrderRepository} from '../../src/repositories';
import {MongoDataSource} from '../../src/datasources';
import {setupApplication} from './helper';
import {createRecommendationServer} from '../../recommender';
import {Server} from 'http';
import * as _ from 'lodash';
import {promisify} from 'util';
import {hash} from 'bcryptjs';
import {getAccessTokenForUser} from '../../src/utils/user.authentication';
const recommendations = require('../../recommender/recommendations.json');
const hashAsync = promisify(hash);

describe('UserController', () => {
  let app: ShoppingApplication;
  let client: Client;
  const mongodbDS = new MongoDataSource();
  const orderRepo = new OrderRepository(mongodbDS);
  const userRepo = new UserRepository(mongodbDS, orderRepo);

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

  it('returns a user with given id when GET /users/{id} is invoked', async () => {
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
    let recommendationService: Server;

    before(() => {
      recommendationService = createRecommendationServer();
    });

    after(() => {
      recommendationService.close();
    });

    it('returns product recommendations for a user', async () => {
      const newUser = await userRepo.create(user);
      await client
        .get(`/users/${newUser.id}/recommend`)
        .expect(200, recommendations);
    });
  });

  describe('authentication functions', () => {
    let plainPassword: string;

    before('create new user', async () => {
      plainPassword = user.password;
      // Salt + Hash Password
      user.password = await hashAsync(user.password, 10);
    });

    it('login returns a valid token', async () => {
      const newUser = await userRepo.create(user);
      await client
        .post('/users/login')
        .send({email: newUser.email, password: plainPassword})
        .expect(200)
        .then(verifyToken);

      function verifyToken(res: Response) {
        const token = res.body.token;
        expect(token).to.not.be.empty();
      }
    });

    it('login returns an error when invalid credentials are used', async () => {
      // tslint:disable-next-line:no-unused
      const newUser = await userRepo.create(user);
      await client
        .post('/users/login')
        .send({email: user.email, password: 'wrongpassword'})
        .expect(401);
    });

    it('/me returns the current user', async () => {
      const newUser = await userRepo.create(user);
      const token = await getAccessTokenForUser(userRepo, {
        email: newUser.email,
        password: plainPassword,
      });

      newUser.id = newUser.id.toString();
      const me = _.pick(toJSON(newUser), ['id', 'email']);

      await client
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .expect(200, me);
    });

    it('/me returns 401 when the token is not provided', async () => {
      const newUser = await userRepo.create(user);
      await getAccessTokenForUser(userRepo, {
        email: newUser.email,
        password: plainPassword,
      });

      await client.get('/users/me').expect(401);
    });
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }
});
