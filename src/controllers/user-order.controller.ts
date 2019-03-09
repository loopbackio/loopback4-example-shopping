// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository, Filter, Where, Count} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {
  post,
  get,
  patch,
  del,
  param,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Order} from '../models';

/**
 * Controller for User's Orders
 */
export class UserOrderController {
  constructor(@repository(UserRepository) protected userRepo: UserRepository) {}

  /**
   * Create or update the orders for a given user
   * @param userId User id
   * @param cart Shopping cart
   */
  @post('/users/{userId}/orders', {
    responses: {
      '200': {
        description: 'User.Order model instance',
        content: {'application/json': {'x-ts-type': Order}},
      },
    },
  })
  async createOrder(
    @param.path.string('userId') userId: string,
    @requestBody() order: Order,
  ): Promise<Order> {
    if (userId !== order.userId) {
      throw new HttpErrors.BadRequest(
        `User id does not match: ${userId} !== ${order.userId}`,
      );
    }
    delete order.userId;
    return await this.userRepo.orders(userId).create(order);
  }

  @get('/users/{userId}/orders', {
    responses: {
      '200': {
        description: "Array of User's Orders",
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Order}},
          },
        },
      },
    },
  })
  async findOrders(
    @param.path.string('userId') userId: string,
    @param.query.string('filter') filter?: Filter,
  ): Promise<Order[]> {
    const orders = await this.userRepo
      .orders(userId)
      .find(filter, {strictObjectIDCoercion: true});
    return orders;
  }

  @patch('/users/{userId}/orders', {
    responses: {
      '200': {
        description: 'User.Order PATCH success count',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                count: 'number',
              },
            },
          },
        },
      },
    },
  })
  async patchOrders(
    @param.path.string('userId') userId: string,
    @requestBody() order: Partial<Order>,
    @param.query.string('where') where?: Where,
  ): Promise<Count> {
    return await this.userRepo
      .orders(userId)
      .patch(order, where, {strictObjectIDCoercion: true});
  }

  @del('/users/{userId}/orders', {
    responses: {
      '200': {
        description: 'User.Order DELETE success count',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                count: 'number',
              },
            },
          },
        },
      },
    },
  })
  async deleteOrders(
    @param.path.string('userId') userId: string,
    @param.query.string('where') where?: Where,
  ): Promise<Count> {
    return await this.userRepo
      .orders(userId)
      .delete(where, {strictObjectIDCoercion: true});
  }
}
