// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {post, param, get, requestBody, HttpErrors} from '@loopback/rest';
import {User, Product} from '../models';
import {UserRepository} from '../repositories';
import {hash} from 'bcryptjs';
import {promisify} from 'util';
import * as isemail from 'isemail';
import {RecommenderService} from '../services/recommender.service';
import {inject} from '@loopback/core';

const hashAsync = promisify(hash);

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject('services.RecommenderService')
    public recommender: RecommenderService,
  ) {}

  @post('/users')
  async create(@requestBody() user: User): Promise<User> {
    // Validate Email
    if (!isemail.validate(user.email)) {
      throw new HttpErrors.UnprocessableEntity('invalid email');
    }

    // Validate Password Length
    if (user.password.length < 8) {
      throw new HttpErrors.UnprocessableEntity(
        'password must be minimum 8 characters',
      );
    }

    // Salt + Hash Password
    user.password = await hashAsync(user.password, 10);

    // Save & Return Result
    const savedUser = await this.userRepository.create(user);
    delete savedUser.password;
    return savedUser;
  }

  @get('/users/{id}')
  async findById(@param.path.string('id') id: string): Promise<User> {
    return this.userRepository.findById(id, {
      fields: {password: false},
    });
  }

  @get('/users/{id}/recommend')
  async productRecommendations(
    @param.path.string('id') id: string,
  ): Promise<Product[]> {
    return this.recommender.recommend(id);
  }
}
