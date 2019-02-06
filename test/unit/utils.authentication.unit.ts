// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, toJSON} from '@loopback/testlab';
import {MongoDataSource} from '../../src/datasources';
import {
  decodeAccessToken,
  getAccessTokenForUser,
  hashPassword,
} from '../../src/utils/user.authentication';
import {UserRepository, OrderRepository} from '../../src/repositories';
import {User} from '../../src/models';
import * as _ from 'lodash';
import {JsonWebTokenError} from 'jsonwebtoken';
import {HttpErrors} from '@loopback/rest';
const SECRET = 'secretforjwt';

describe('authentication utilities', () => {
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

  before(clearDatabase);
  before(createUser);

  it('getAccessTokenForUser creates valid jwt access token', async () => {
    const token = await getAccessTokenForUser(userRepo, {
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
      getAccessTokenForUser(userRepo, {
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
      getAccessTokenForUser(userRepo, {
        email: 'unittest@loopback.io',
        password: 'fake',
      }),
    ).to.be.rejectedWith(expectedError);
  });

  it('decodeAccessToken decodes valid access token', async () => {
    const token = await getAccessTokenForUser(userRepo, {
      email: 'unittest@loopback.io',
      password: 'p4ssw0rd',
    });
    const expectedUser = getExpectedUser(newUser);
    const currentUser = await decodeAccessToken(token, SECRET);
    expect(currentUser).to.deepEqual(expectedUser);
  });

  it('decodeAccessToken throws error for invalid accesstoken', async () => {
    const token = 'fake';
    const error = new JsonWebTokenError('jwt malformed');
    return expect(decodeAccessToken(token, SECRET)).to.be.rejectedWith(error);
  });

  async function createUser() {
    user.password = await hashPassword(user.password, 4);
    newUser = await userRepo.create(user);
  }
  async function clearDatabase() {
    await userRepo.deleteAll();
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
