// Copyright IBM Corp. 2018, 2019. All Rights Reserved.
// Node module: @loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as _ from 'lodash';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {toJSON} from '@loopback/testlab';
import {promisify} from 'util';
import * as isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/authentication';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export async function getAccessTokenForUser(
  userRepository: UserRepository,
  credentials: Credentials,
): Promise<string> {
  const foundUser = await userRepository.findOne({
    where: {email: credentials.email, password: credentials.password},
  });
  if (!foundUser) {
    throw new HttpErrors.Unauthorized('Wrong credentials!');
  }

  const currentUser = _.pick(toJSON(foundUser), ['id', 'email', 'firstName']);
  // Generate user token using JWT
  const token = await signAsync(currentUser, 'secretforjwt', {
    expiresIn: 300,
  });

  return token;
}

export function validateCredentials(credentials: Credentials) {
  // Validate Email
  if (!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid email');
  }

  // Validate Password Length
  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password must be minimum 8 characters',
    );
  }
}

// secret should be injected
export async function decodeAccessToken(
  token: string,
  secret: string,
): Promise<UserProfile> {
  const decoded = await verifyAsync(token, secret);
  let user = _.pick(decoded, ['id', 'email', 'firstName']);
  (user as UserProfile).name = user.firstName;
  delete user.firstName;
  return user;
}
