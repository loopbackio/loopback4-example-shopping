// Copyright IBM Corp. 2018, 2019. All Rights Reserved.
// Node module: @loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const jwt = require('jsonwebtoken');
import {promisify} from 'util';
const verifyAsync = promisify(jwt.verify);
// Consider turn it to a binding
const SECRET = 'secretforjwt';
import {Request, HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/authentication';
import * as _ from 'lodash';
import {AuthenticationStrategy} from './authentication.strategy';

export class JWTStrategy implements AuthenticationStrategy {
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = request.query.access_token || request.headers['authorization'];
    if (!token) throw new HttpErrors.Unauthorized('No access token found!');

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    try {
      const decoded = await verifyAsync(token, SECRET);
      let user = _.pick(decoded, ['id', 'email', 'firstName']);
      (user as UserProfile).name = user.firstName;
      delete user.firstName;
      return user;
    } catch (err) {
      Object.assign(err, {
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      });
      throw err;
    }
  }
}
