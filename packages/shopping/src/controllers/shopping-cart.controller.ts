// Copyright IBM Corp. 2019,2020. All Rights Reserved.
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
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {UserProfile, SecurityBindings} from '@loopback/security';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ShoppingCartRepository} from '../repositories';
import {ShoppingCart, ShoppingCartItem} from '../models';
import {basicAuthorization} from '../services/basic.authorizor';
import debugFactory from 'debug';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
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
   * Create the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @post('/shoppingCarts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User shopping cart is created or updated',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async create(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart'}) cart: ShoppingCart,
  ): Promise<void> {
    debug('Create shopping cart %s: %j', userId, cart);
    await this.shoppingCartRepository.set(userId, cart);
  }

  /**
   * Create or update the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @put('/shoppingCarts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User shopping cart is created or updated',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async set(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart'}) cart: ShoppingCart,
  ): Promise<void> {
    debug('Create shopping cart %s: %j', userId, cart);
    await this.shoppingCartRepository.set(userId, cart);
  }

  /**
   * Retrieve the shopping cart by user id
   * @param userId User id
   */
  @get('/shoppingCarts/{userId}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User shopping cart is read',
        content: {'application/json': {schema: {'x-ts-type': ShoppingCart}}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async get(
    @param.path.string('userId') userId: string,
  ): Promise<ShoppingCart> {
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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User shopping cart is deleted',
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async remove(@param.path.string('userId') userId: string): Promise<void> {
    debug('Remove shopping cart %s', userId);
    await this.shoppingCartRepository.delete(userId);
  }

  /**
   * Add an item to the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart item to be added
   */
  @post('/shoppingCarts/{userId}/items', {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async addItem(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart item'}) item: ShoppingCartItem,
  ): Promise<ShoppingCart> {
    debug('Add item %j to shopping cart %s', item, userId);
    return this.shoppingCartRepository.addItem(userId, item);
  }
}
