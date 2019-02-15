// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, toJSON} from '@loopback/testlab';
import {MongoDataSource} from '../../src/datasources';
import {JWTAuthenticationService} from '../../src/services/JWT.authentication.service';
import {ShoppingApplication} from '../..';
import {PasswordHasher} from '../../src/services/hash.password.bcryptjs';
import {UserRepository, OrderRepository} from '../../src/repositories';
import {User} from '../../src/models';
import * as _ from 'lodash';
import {JsonWebTokenError} from 'jsonwebtoken';
import {HttpErrors} from '@loopback/rest';
import {
  PasswordHasherBindings,
  JWTAuthenticationBindings,
} from '../../src/keys';
import {setupApplication} from './helper';

describe('authentication services', () => {
  let app: ShoppingApplication;

  const mongodbDS = new MongoDataSource();
  const orderRepo = new OrderRepository(mongodbDS);
  const userRepo = new UserRepository(mongodbDS, orderRepo);

  const user = {
    email: 'unittest@loopback.io',
    password: 'p4ssw0rd',
    firstname: 'unit',
    surname: 'test',
  };
  let newUser: User;
  let jwtService: JWTAuthenticationService;
  let bcryptHasher: PasswordHasher;

  before(setupApp);
  before(clearDatabase);
  before(createUser);
  before(createService);

  it('getAccessTokenForUser creates valid jwt access token', async () => {
    const token = await jwtService.getAccessTokenForUser({
      email: 'unittest@loopback.io',
      password: 'p4ssw0rd',
    });
    expect(token).to.not.be.empty();
  });

  it('getAccessTokenForUser rejects non-existing user with error Not Found', async () => {
    const expectedError = new HttpErrors['NotFound'](
      `User with email fake@loopback.io not found.`,
    );
    return expect(
      jwtService.getAccessTokenForUser({
        email: 'fake@loopback.io',
        password: 'fake',
      }),
    ).to.be.rejectedWith(expectedError);
  });

  it('getAccessTokenForUser rejects wrong credential with error Unauthorized', async () => {
    const expectedError = new HttpErrors.Unauthorized(
      'The credentials are not correct.',
    );
    return expect(
      jwtService.getAccessTokenForUser({
        email: 'unittest@loopback.io',
        password: 'fake',
      }),
    ).to.be.rejectedWith(expectedError);
  });

  it('decodeAccessToken decodes valid access token', async () => {
    const token = await jwtService.getAccessTokenForUser({
      email: 'unittest@loopback.io',
      password: 'p4ssw0rd',
    });
    const expectedUser = getExpectedUser(newUser);
    const currentUser = await jwtService.decodeAccessToken(token);
    expect(currentUser).to.deepEqual(expectedUser);
  });

  it('decodeAccessToken throws error for invalid accesstoken', async () => {
    const token = 'fake';
    const error = new JsonWebTokenError('jwt malformed');
    return expect(jwtService.decodeAccessToken(token)).to.be.rejectedWith(
      error,
    );
  });

  async function setupApp() {
    app = await setupApplication();
    app.bind(PasswordHasherBindings.ROUNDS).to(4);
  }

  async function createUser() {
    bcryptHasher = await app.get(PasswordHasherBindings.PASSWORD_HASHER);
    user.password = await bcryptHasher.hashPassword(user.password);
    newUser = await userRepo.create(user);
  }

  async function clearDatabase() {
    await userRepo.deleteAll();
  }

  async function createService() {
    jwtService = await app.get(JWTAuthenticationBindings.SERVICE);
  }
});

function getExpectedUser(originalUser: User) {
  const userProfile: Partial<User> = _.pick(toJSON(originalUser), [
    'id',
    'email',
    'firstName',
  ]);
  return {
    id: userProfile.id,
    email: userProfile.email,
    name: userProfile.firstname,
  };
}
