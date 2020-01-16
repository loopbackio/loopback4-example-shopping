// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  put,
  get,
  del,
  param,
  requestBody,
  HttpErrors,
  post,
} from '@loopback/rest';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ShoppingCartRepository} from '../repositories';
import {ShoppingCart, ShoppingCartItem} from '../models';
import {basicAuthorization} from '../services/basic.authorizor';
import debugFactory from 'debug';
const debug = debugFactory('loopback:example:shopping');

/**
 * Controller for shopping cart
 */
export class ShoppingCartController {
  constructor(
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile,
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository,
  ) {}

  /**
   * Create or update the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @put('/shoppingCarts/{userId}', {
    responses: {
      '204': {
        description: 'User shopping cart is created or updated',
      },
    },
  })
  @authenticate('jwt')
  async set(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart'}) cart: ShoppingCart,
  ): Promise<void> {
    const currentUserId = this.currentUserProfile[securityId];
    if (currentUserId === cart.userId && currentUserId === userId) {
      debug('Create shopping cart %s: %j', userId, cart);
      await this.shoppingCartRepository.set(userId, cart);
    } else {
      throw HttpErrors(401);
    }
  }

  /**
   * Retrieve the shopping cart by user id
   * @param userId User id
   */
  @get('/shoppingCarts/{userId}', {
    responses: {
      '200': {
        description: 'User shopping cart is read',
        content: {'application/json': {schema: {'x-ts-type': ShoppingCart}}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({resource: 'shoppingCarts', scopes: ['find'], voters: [basicAuthorization]})
  async get(
    @param.path.string('userId') userId: string,
  ): Promise<ShoppingCart> {
    /*
    if (this.currentUserProfile[securityId] === userId) {
      debug('Get shopping cart %s', userId);
      const cart = await this.shoppingCartRepository.get(userId);
      debug('Shopping cart %s: %j', userId, cart);
      if (cart == null) {
        throw new HttpErrors.NotFound(
          `Shopping cart not found for user: ${userId}`,
        );
      } else {
        return cart;
      }
    } else {
      throw HttpErrors(401);
    }
    */
    debug('Get shopping cart %s', userId);
    const cart = await this.shoppingCartRepository.get(userId);
    debug('Shopping cart %s: %j', userId, cart);
    if (cart == null) {
      throw new HttpErrors.NotFound(
        `Shopping cart not found for user: ${userId}`,
      );
    } else {
      return cart;
    }
  }

  /**
   * Delete the shopping cart by user id
   * @param userId User id
   */
  @del('/shoppingCarts/{userId}', {
    responses: {
      '204': {
        description: 'User shopping cart is deleted',
      },
    },
  })
  @authenticate('jwt')
  async remove(@param.path.string('userId') userId: string): Promise<void> {
    if (this.currentUserProfile[securityId] === userId) {
      debug('Remove shopping cart %s', userId);
      await this.shoppingCartRepository.delete(userId);
    } else {
      throw HttpErrors(401);
    }
  }

  /**
   * Add an item to the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart item to be added
   */
  @post('/shoppingCarts/{userId}/items', {
    responses: {
      '200': {
        description: 'User shopping cart item is created',
        content: {
          'application/json': {schema: {'x-ts-type': ShoppingCart}},
        },
      },
    },
  })
  @authenticate('jwt')
  async addItem(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart item'}) item: ShoppingCartItem,
  ): Promise<ShoppingCart> {
    if (this.currentUserProfile[securityId] === userId) {
      debug('Add item %j to shopping cart %s', item, userId);
      return this.shoppingCartRepository.addItem(userId, item);
    } else {
      throw HttpErrors(401);
    }
  }
}
