// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createClientForHandler, supertest, expect} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {ShoppingApplication} from '../..';
import {UserRepository} from '../../src/repositories';
import {UserDataSource} from '../../src/datasources';

describe('UserController', () => {
  let app: ShoppingApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;
  const userRepo = new UserRepository(new UserDataSource());

  const user = {
    email: 'test@loopback.io',
    password: 'p4ssw0rd',
    firstname: 'Example',
    surname: 'User',
  };

  before(givenAnApplication);

  before(givenARestServer);

  before(async () => {
    await app.boot();
    await app.start();
  });

  before(() => {
    client = createClientForHandler(server.requestHandler);
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
    // MongoDB returns an id object we need to convert to string
    // since the REST API returns a string for the id property.
    newUser.id = newUser.id.toString();

    await client.get(`/users/${newUser.id}`).expect(200, newUser.toJSON());
  });

  function givenAnApplication() {
    app = new ShoppingApplication({
      rest: {
        port: 0,
      },
    });
  }

  async function givenARestServer() {
    server = await app.getServer(RestServer);
  }

  async function clearDatabase() {
    await userRepo.deleteAll();
  }
});
