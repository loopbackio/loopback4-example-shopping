// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {User, Order} from '../models';
import {inject} from '@loopback/core';
import {OrderRepository} from './order.repository';
export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>;

  constructor(
    @inject('datasources.mongo') protected datasource: juggler.DataSource,
    @repository(OrderRepository) protected orderRepository: OrderRepository,
  ) {
    super(User, datasource);
    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      async () => orderRepository,
    );
  }
}
