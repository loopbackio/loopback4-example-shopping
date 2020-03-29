// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Order} from '../models';
import {UserRepository} from '../repositories';
import {basicAuthorization} from '../services/basic.authorizor';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.Order model instance',
        content: {'application/json': {schema: {'x-ts-type': Order}}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async createOrder(
    @param.path.string('userId') userId: string,
    @requestBody() order: Order,
  ): Promise<Order> {
    order.date = new Date().toString();
    return this.userRepo
      .orders(userId)
      .create(order)
      .catch(e => {
        throw HttpErrors(400);
      });
  }

  @get('/users/{userId}/orders', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async findOrders(
    @param.path.string('userId') userId: string,
    @param.query.object('filter', getFilterSchemaFor(Order))
    filter?: Filter<Order>,
  ): Promise<Order[]> {
    const orders = await this.userRepo.orders(userId).find(filter);
    return orders;
  }

  @patch('/users/{userId}/orders', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.Order PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async patchOrders(
    @param.path.string('userId') userId: string,
    @requestBody() order: Partial<Order>,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.userRepo.orders(userId).patch(order, where);
  }

  @del('/users/{userId}/orders', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.Order DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['customer'], voters: [basicAuthorization]})
  async deleteOrders(
    @param.path.string('userId') userId: string,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.userRepo.orders(userId).delete(where);
  }
}
