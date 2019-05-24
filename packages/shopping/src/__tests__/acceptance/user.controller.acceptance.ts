// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {ShoppingApplication} from '../..';
import {UserRepository, OrderRepository} from '../../repositories';
import {MongoDataSource} from '../../datasources';
import {setupApplication} from './helper';
import {
  createRecommendationServer,
  HttpServer,
} from 'loopback4-example-recommender';
import {PasswordHasher} from '../../services/hash.password.bcryptjs';
import {PasswordHasherBindings, TokenServiceConstants} from '../../keys';
import {JWTService} from '../../services/jwt-service';

const recommendations = require('loopback4-example-recommender/data/recommendations.json');

describe('UserController', () => {
  let app: ShoppingApplication;
  let client: Client;
  const mongodbDS = new MongoDataSource();
  const orderRepo = new OrderRepository(mongodbDS);
  const userRepo = new UserRepository(mongodbDS, orderRepo);

  const user = {
    email: 'test@loopback.io',
    password: 'p4ssw0rd',
    firstName: 'Example',
    lastName: 'User',
  };

  let passwordHasher: PasswordHasher;
  let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  before(createPasswordHasher);
  before(givenAnExpiredToken);

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
    expect(res.body.firstName).to.equal('Example');
    expect(res.body.lastName).to.equal('User');
    expect(res.body).to.have.property('id');
    expect(res.body).to.not.have.property('password');
  });

  it('throws error for POST /users with a missing email', async () => {
    const res = await client
      .post('/users')
      .send({
        password: 'p4ssw0rd',
        firstName: 'Example',
        lastName: 'User',
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
        firstName: 'Example',
        lastName: 'User',
      })
      .expect(422);

    expect(res.body.error.message).to.equal('invalid email');
  });

  it('throws error for POST /users with a missing password', async () => {
    const res = await client
      .post('/users')
      .send({
        email: 'test@loopback.io',
        firstName: 'Example',
        lastName: 'User',
      })
      .expect(422);

    const errorText = JSON.parse(res.error.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal(
      'password',
    );
  });

  it('throws error for POST /users with a string', async () => {
    const res = await client
      .post('/users')
      .send('hello')
      .expect(415);
    expect(res.body.error.message).to.equal(
      'Content-type application/x-www-form-urlencoded does not match [application/json].',
    );
  });

  it('returns a user with given id when GET /users/{id} is invoked', async () => {
    const newUser = await createAUser();
    delete newUser.password;
    delete newUser.orders;

    await client.get(`/users/${newUser.id}`).expect(200, newUser.toJSON());
  });

  describe('authentication', () => {
    it('login returns a JWT token', async () => {
      const newUser = await createAUser();

      const res = await client
        .post('/users/login')
        .send({email: newUser.email, password: user.password})
        .expect(200);

      const token = res.body.token;
      expect(token).to.not.be.empty();
    });

    it('login returns an error when invalid email is used', async () => {
      await createAUser();

      const res = await client
        .post('/users/login')
        .send({email: 'idontexist@example.com', password: user.password})
        .expect(404);

      expect(res.body.error.message).to.equal(
        'User with email idontexist@example.com not found.',
      );
    });

    it('login returns an error when invalid password is used', async () => {
      const newUser = await createAUser();

      const res = await client
        .post('/users/login')
        .send({email: newUser.email, password: 'wrongpassword'})
        .expect(401);

      expect(res.body.error.message).to.equal(
        'The credentials are not correct.',
      );
    });

    it('users/me returns the current user profile when a valid JWT token is provided', async () => {
      const newUser = await createAUser();

      let res = await client
        .post('/users/login')
        .send({email: newUser.email, password: user.password})
        .expect(200);

      const token = res.body.token;

      res = await client
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .expect(200);

      const userProfile = res.body;
      expect(userProfile.id).to.equal(newUser.id);
      expect(userProfile.name).to.equal(
        `${newUser.firstName} ${newUser.lastName}`,
      );
    });

    it('users/me returns an error when a JWT token is not provided', async () => {
      const res = await client.get('/users/me').expect(401);

      expect(res.body.error.message).to.equal(
        'Authorization header not found.',
      );
    });

    it('users/me returns an error when an invalid JWT token is provided', async () => {
      const res = await client
        .get('/users/me')
        .set('Authorization', 'Bearer ' + 'xxx.yyy.zzz')
        .expect(401);

      expect(res.body.error.message).to.equal(
        'Error verifying token : invalid token',
      );
    });

    it(`users/me returns an error when 'Bearer ' is not found in Authorization header`, async () => {
      const res = await client
        .get('/users/me')
        .set('Authorization', 'NotB3@r3r ' + 'xxx.yyy.zzz')
        .expect(401);

      expect(res.body.error.message).to.equal(
        "Authorization header is not of type 'Bearer'.",
      );
    });

    it('users/me returns an error when an expired JWT token is provided', async () => {
      const res = await client
        .get('/users/me')
        .set('Authorization', 'Bearer ' + expiredToken)
        .expect(401);

      expect(res.body.error.message).to.equal(
        'Error verifying token : jwt expired',
      );
    });
  });

  describe('user product recommendation (service) api', () => {
    let recommendationService: HttpServer;

    before(async () => {
      recommendationService = createRecommendationServer();
      await recommendationService.start();
    });

    after(async () => {
      await recommendationService.stop();
    });

    it('returns product recommendations for a user', async () => {
      const newUser = await createAUser();
      await client
        .get(`/users/${newUser.id}/recommend`)
        .expect(200, recommendations);
    });
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
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

  /**
   * Creates an expired token
   *
   * Specifying a negative value for 'expiresIn' so the
   * token is automatically expired
   */
  async function givenAnExpiredToken() {
    const newUser = await createAUser();
    const tokenService: JWTService = new JWTService(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
      '-1',
    );
    const userProfile = {
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
    };
    expiredToken = await tokenService.generateToken(userProfile);
  }
});
