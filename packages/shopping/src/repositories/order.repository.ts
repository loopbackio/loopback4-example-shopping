// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Order} from '../models';
import {inject} from '@loopback/core';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.orderId
> {
  constructor(
    @inject('datasources.mongo') protected datasource: juggler.DataSource,
  ) {
    super(Order, datasource);
  }
}
