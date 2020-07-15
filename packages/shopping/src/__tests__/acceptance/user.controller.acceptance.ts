// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {TokenServiceConstants} from '@loopback/authentication-jwt';
import {securityId} from '@loopback/security';
import {Client, expect} from '@loopback/testlab';
import {Server} from 'grpc';
import {
  createGRPCRecommendationServer,
  createRecommendationServer,
  HttpServer,
} from 'loopback4-example-recommender';
import {HTTPError} from 'superagent';
import {ShoppingApplication} from '../..';
import {PasswordHasherBindings} from '../../keys';
import {UserRepository} from '../../repositories';
import {RecommenderService} from '../../services';
import {PasswordHasher} from '../../services/hash.password.bcryptjs';
import {JWTService} from '../../services/jwt-service';
import {setupApplication} from './helper';

const recommendations = require('loopback4-example-recommender/data/recommendations.json');

describe('UserController', () => {
  let app: ShoppingApplication;
  let client: Client;

  let userRepo: UserRepository;

  const userData = {
    email: 'test@loopback.io',
    firstName: 'Example',
    lastName: 'User',
    roles: ['customer'],
  };

  const userPassword = 'p4ssw0rd';

  let passwordHasher: PasswordHasher;
  let expiredToken: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepo = await app.get('repositories.UserRepository');
  });
  before(migrateSchema);
  before(createPasswordHasher);
  before(givenAnExpiredToken);

  beforeEach(clearDatabase);

  after(async () => {
    await app.stop();
  });

  it('creates new user when POST /users is invoked', async () => {
    const res = await client
      .post('/users')
      .send({...userData, password: userPassword})
      .expect(200);

    // Assertions
    expect(res.body.email).to.equal('test@loopback.io');
    expect(res.body.firstName).to.equal('Example');
    expect(res.body.lastName).to.equal('User');
    expect(res.body).to.have.property('id');
    expect(res.body).to.not.have.property('password');
  });

  it('creates a new user with the given id', async () => {
    // This test verifies the scenario described in our docs, see
    // https://loopback.io/doc/en/lb4/Authentication-Tutorial.html
    const res = await client.post('/users').send({
      id: '5dd6acee242760334f6aef65',
      ...userData,
      password: userPassword,
    });
    expect(res.body).to.deepEqual({
      id: '5dd6acee242760334f6aef65',
      ...userData,
    });
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

    expect(res.error).to.not.eql(false);
    const resError = res.error as HTTPError;
    const errorText = JSON.parse(resError.text);
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

    expect(res.error).to.not.eql(false);
    const resError = res.error as HTTPError;
    const errorText = JSON.parse(resError.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal(
      'password',
    );
  });

  it('throws error for POST /users with a string', async () => {
    const res = await client.post('/users').send('hello').expect(415);
    expect(res.body.error.message).to.equal(
      'Content-type application/x-www-form-urlencoded does not match [application/json].',
    );
  });

  it('throws error for POST /users with an existing email', async () => {
    await client
      .post('/users')
      .send({...userData, password: userPassword})
      .expect(200);
    const res = await client
      .post('/users')
      .send({...userData, password: userPassword})
      .expect(409);

    expect(res.body.error.message).to.equal('Email value is already taken');
  });

  it('protects GET /users/{id} with authorization', async () => {
    const newUser = await createAUser();
    delete newUser.orders;

    await client.get(`/users/${newUser.id}`).expect(401);
  });

  describe('authentication', () => {
    it('login returns a JWT token', async () => {
      const newUser = await createAUser();

      const res = await client
        .post('/users/login')
        .send({email: newUser.email, password: userPassword})
        .expect(200);

      const token = res.body.token;
      expect(token).to.not.be.empty();
    });

    it('login returns an error when invalid email is used', async () => {
      await createAUser();

      const res = await client
        .post('/users/login')
        .send({email: 'idontexist@example.com', password: userPassword})
        .expect(401);

      expect(res.body.error.message).to.equal('Invalid email or password.');
    });

    it('login returns an error when invalid password is used', async () => {
      const newUser = await createAUser();

      const res = await client
        .post('/users/login')
        .send({email: newUser.email, password: 'wrongpassword'})
        .expect(401);

      expect(res.body.error.message).to.equal('Invalid email or password.');
    });

    it('users/me returns the current user profile when a valid JWT token is provided', async () => {
      const newUser = await createAUser();

      let res = await client
        .post('/users/login')
        .send({email: newUser.email, password: userPassword})
        .expect(200);

      const token = res.body.token;

      res = await client
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .expect(200);

      const userProfile = res.body;
      expect(userProfile.id).to.equal(newUser.id);
      expect(userProfile.firstName).to.equal(newUser.firstName);
      expect(userProfile.lastName).to.equal(newUser.lastName);
      expect(userProfile.roles).to.deepEqual(newUser.roles);
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
    let recommendationGRPCService: Server;

    before(async () => {
      recommendationService = createRecommendationServer();
      await recommendationService.start();
      recommendationGRPCService = createGRPCRecommendationServer();
      recommendationGRPCService.start();
    });

    after(async () => {
      await recommendationService.stop();
      recommendationGRPCService.forceShutdown();
    });

    it('returns product recommendations for a user', async () => {
      const newUser = await createAUser();
      await client
        .get(`/users/${newUser.id}/recommend`)
        .expect(200, recommendations['user001']);
    });

    it('returns product recommendations for a user using gRPC', async () => {
      const recommender = await app.get<RecommenderService>(
        'services.RecommenderGrpcService',
      );
      const products = await recommender.getProductRecommendations('user001');
      expect(products).to.eql(recommendations['user001']);
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
    const newUser = await userRepo.create(userData);
    // MongoDB returns an id object we need to convert to string
    newUser.id = newUser.id.toString();

    await userRepo.userCredentials(newUser.id).create({
      password: encryptedPassword,
    });

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
      [securityId]: newUser.id,
      name: `${newUser.firstName} ${newUser.lastName}`,
    };
    expiredToken = await tokenService.generateToken(userProfile);
  }
});
