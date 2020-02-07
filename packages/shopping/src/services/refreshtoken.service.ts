// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {UserRefreshtokenRepository} from '../repositories/user-refreshtoken.repository';
import {User} from '../models/user.model';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';

export interface RefreshtokenService<U> {
  generateRefreshtoken(user: User): Promise<string>;
  verifyRefreshtoken(
    refreshtoken: string,
    userProfile: UserProfile,
  ): Promise<void>;
  revokeRefreshtoken(
    refreshtoken: string,
    userProfile: UserProfile,
  ): Promise<void>;
}

export class MyRefreshtokenService implements RefreshtokenService<User> {
  constructor(
    @repository(UserRefreshtokenRepository)
    public userRefreshtokenRepository: UserRefreshtokenRepository,
  ) {}

  async generateRefreshtoken(user: User): Promise<string> {
    const userRefreshtoken = await this.userRefreshtokenRepository.create({
      creation: new Date(),
      // TODO(derdeka) inject ttl setting
      ttl: 60 * 60 * 6,
      userId: user.id,
    });
    return userRefreshtoken.id;
  }

  async verifyRefreshtoken(
    refreshtoken: string,
    userProfile: UserProfile,
  ): Promise<void> {
    try {
      // TODO(derdeka) check ttl and creation date
      await this.userRefreshtokenRepository.findById(refreshtoken, {
        where: {
          userId: userProfile[securityId],
        },
      });
    } catch (e) {
      throw new HttpErrors.Unauthorized('Invalid accessToken');
    }
  }

  async revokeRefreshtoken(
    refreshtoken: string,
    userProfile: UserProfile,
  ): Promise<void> {
    try {
      await this.userRefreshtokenRepository.deleteById(refreshtoken, {
        where: {
          userId: userProfile[securityId],
        },
      });
    } catch (e) {
      // ignore
    }
  }
}
