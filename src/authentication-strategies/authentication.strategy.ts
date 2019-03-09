// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {UserProfile} from '@loopback/authentication';
import {Request} from '@loopback/rest';

/**
 * An interface describes the common authentication strategy.
 *
 * An authentication strategy is usually a class with an
 * authenticate method that verifies a user's identity and
 * returns the corresponding user profile.
 *
 * Please note this file should be moved to @loopback/authentication
 */
export interface AuthenticationStrategy {
  authenticate(request: Request): Promise<UserProfile | undefined>;
}
