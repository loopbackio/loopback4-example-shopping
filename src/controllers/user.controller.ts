// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {post, param, get, requestBody} from '@loopback/rest';
import {User, Product} from '../models';
import {UserRepository} from '../repositories';
import {RecommenderService} from '../services/recommender.service';
import {inject, Setter} from '@loopback/core';
import {
  authenticate,
  UserProfile,
  AuthenticationBindings,
} from '@loopback/authentication';
import {Credentials} from '../repositories/user.repository';
import {HashPassword} from '../services/hash.password.bcryptjs';
import {JWTAuthenticationService} from '../services/JWT.authentication.service';
import {JWTAuthenticationBindings, OtherServicesBindings} from '../keys';
import {validateCredentials} from '../services/JWT.authentication.service';
import * as _ from 'lodash';

// TODO(jannyHou): This should be moved to @loopback/authentication
const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject('services.RecommenderService')
    public recommender: RecommenderService,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    public setCurrentUser: Setter<UserProfile>,
    @inject(OtherServicesBindings.HASH_PASSWORD)
    public hashPassword: HashPassword,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwt_authentication_service: JWTAuthenticationService,
  ) {}

  @post('/users')
  async create(@requestBody() user: User): Promise<User> {
    validateCredentials(_.pick(user, ['email', 'password']));
    user.password = await this.hashPassword(user.password, 10);

    // Save & Return Result
    const savedUser = await this.userRepository.create(user);
    delete savedUser.password;
    return savedUser;
  }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId, {
      fields: {password: false},
    });
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<UserProfile> {
    return currentUser;
  }

  // TODO(@jannyHou): missing logout function.
  // as a stateless authentication method, JWT doesn't actually
  // have a logout operation. See article for details:
  // https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6

  @get('/users/{userId}/recommend', {
    responses: {
      '200': {
        description: 'Products',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                'x-ts-type': Product,
              },
            },
          },
        },
      },
    },
  })
  async productRecommendations(
    @param.path.string('userId') userId: string,
  ): Promise<Product[]> {
    return this.recommender.getProductRecommendations(userId);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody() credentials: Credentials,
  ): Promise<{token: string}> {
    validateCredentials(credentials);
    const token = await this.jwt_authentication_service.getAccessTokenForUser(
      credentials,
    );
    return {token};
  }
}
