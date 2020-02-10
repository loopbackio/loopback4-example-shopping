// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {UserRefreshtokenRepository} from '../repositories/user-refreshtoken.repository';
import {RefreshtokenServiceBindings} from '../keys';

export interface RefreshtokenService extends TokenService {
  /**
   * Verifies the validity of a token string and returns a user profile
   *
   * TODO(derdeka) move optional parameter userProfile to TokenService?
   */
  verifyToken(token: string, userProfile?: UserProfile): Promise<UserProfile>;
  /**
   * Revokes a given token (if supported by token system)
   */
  revokeToken(token: string, userProfile?: UserProfile): Promise<void>;
}

export class MyRefreshtokenService implements RefreshtokenService {
  constructor(
    @repository(UserRefreshtokenRepository)
    public userRefreshtokenRepository: UserRefreshtokenRepository,
    @inject(RefreshtokenServiceBindings.REFRESHTOKEN_ETERNAL_ALLOWED, {
      optional: true,
    })
    private refreshtokenEternalAllowed: boolean = false,
    @inject(RefreshtokenServiceBindings.REFRESHTOKEN_EXPIRES_IN, {
      optional: true,
    })
    private refreshtokenExpiresIn: number = 60 * 60 * 24,
  ) {}

  async generateToken(userProfile: UserProfile): Promise<string> {
    // TODO(derdeka) objectId as refreshtoken is a bad idea
    const userRefreshtoken = await this.userRefreshtokenRepository.create({
      creation: new Date(),
      ttl: this.refreshtokenExpiresIn,
      userId: userProfile[securityId],
    });
    return userRefreshtoken.id;
  }

  async verifyToken(
    refreshtoken: string,
    userProfile?: UserProfile,
  ): Promise<UserProfile> {
    try {
      if (!userProfile || !userProfile[securityId]) {
        throw new HttpErrors.Unauthorized('Invalid refreshToken');
      }
      const {creation, ttl} = await this.userRefreshtokenRepository.findById(
        refreshtoken,
        {
          where: {
            userId: userProfile[securityId],
          },
        },
      );
      const isEternalToken = ttl === -1;
      const elapsedSeconds = (Date.now() - creation.getTime()) / 1000;
      const isValid = isEternalToken
        ? this.refreshtokenEternalAllowed
        : elapsedSeconds < ttl;
      if (!isValid) {
        throw new HttpErrors.Unauthorized('Invalid refreshToken');
      }
      return userProfile;
    } catch (e) {
      throw new HttpErrors.Unauthorized('Invalid refreshToken');
    }
  }

  async revokeToken(
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
