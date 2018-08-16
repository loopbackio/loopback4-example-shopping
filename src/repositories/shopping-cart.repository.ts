// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DefaultKeyValueRepository} from '@loopback/repository';
import {ShoppingCart} from '../models/shopping-cart.model';
import {RedisDataSource} from '../datasources/redis.datasource';

export class ShoppingCartRepository extends DefaultKeyValueRepository<
  ShoppingCart
> {
  constructor() {
    super(ShoppingCart, new RedisDataSource());
  }
}
