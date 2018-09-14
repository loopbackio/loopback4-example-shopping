// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {put, get, del, param, requestBody, HttpErrors} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {ShoppingCartRepository} from '../repositories';
import {ShoppingCart} from '../models';

/**
 * Controller for shopping cart
 */
export class ShoppingCartController {
  constructor(
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository,
  ) {}

  /**
   * Create or update the shopping cart for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @put('/shoppingCarts/{userId}')
  async set(
    @param.path.string('userId') userId: string,
    @requestBody({description: 'shopping cart'}) cart: ShoppingCart,
  ) {
    if (userId !== cart.userId) {
      throw new HttpErrors.BadRequest(
        `User id does not match: ${userId} !== ${cart.userId}`,
      );
    }
    await this.shoppingCartRepository.set(userId, cart);
  }

  /**
   * Retrieve the shopping cart by user id
   * @param userId User id
   */
  @get('/shoppingCarts/{userId}')
  async get(@param.path.string('userId') userId: string) {
    const cart = await this.shoppingCartRepository.get(userId);
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
  @del('/shoppingCarts/{userId}')
  async remove(@param.path.string('userId') userId: string) {
    await this.shoppingCartRepository.delete(userId);
  }
}
