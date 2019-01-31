// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect, toJSON} from '@loopback/testlab';
import {MongoDataSource} from '../../src/datasources';
import {
  decodeAccessToken,
  getAccessTokenForUser,
} from '../../src/utils/user.authentication';
import {UserRepository, OrderRepository} from '../../src/repositories';
import {User} from '../../src/models';
import * as _ from 'lodash';
const SECRET = 'secretforjwt';

describe('authentication', () => {
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

  before('create user', async () => {
    newUser = await userRepo.create(user);
  });

  it('decodes valid access token', async () => {
    const token = await getAccessTokenForUser(userRepo, {
      email: 'unittest@loopback.io',
      password: 'p4ssw0rd',
    });
    const expectedUser = getExpectedUser(newUser);
    const currentUser = await decodeAccessToken(token, SECRET);
    expect(currentUser).to.deepEqual(expectedUser);
  });

  it('throws error for invalid accesstoken', async () => {
    const token = 'fake';
    try {
      await decodeAccessToken(token, SECRET);
      expect('throws error').to.be.true();
    } catch (err) {
      expect(err.message).to.equal('jwt malformed');
    }
  });
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
