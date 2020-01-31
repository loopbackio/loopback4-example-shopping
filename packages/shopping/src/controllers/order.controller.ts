import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {basicAuthorization} from '../services/basic.authorizor';
import {Order} from '../models';
import {OrderRepository} from '../repositories';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository : OrderRepository,
  ) {}
  @get('/orders/{id}', {
    responses: {
      '200': {
        description: 'Order model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Order, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin', 'support'], voters: [basicAuthorization]})
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Order)) filter?: Filter<Order>
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }
}
