// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
  HasOneRepositoryFactory,
} from '@loopback/repository';
import {User, Order, UserCredentials} from '../models';
import {inject, Getter} from '@loopback/core';
import {OrderRepository} from './order.repository';
import {UserCredentialsRepository} from './user-credentials.repository';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public orders: HasManyRepositoryFactory<Order, typeof User.prototype.id>;

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') protected datasource: juggler.DataSource,
    @repository(OrderRepository) protected orderRepository: OrderRepository,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<
      UserCredentialsRepository
    >,
  ) {
    super(User, datasource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      async () => orderRepository,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
