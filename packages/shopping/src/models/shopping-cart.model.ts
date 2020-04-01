// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ShoppingCartItem} from './shopping-cart-item.model';
import {User} from './user.model';

@model()
export class ShoppingCart extends Entity {
  /**
   * Each shopping cart belongs to a user, indentified by its id (userId)
   */
  @belongsTo(() => User)
  userId: string;

  /**
   * Items in the shopping cart
   */
  @property.array(ShoppingCartItem)
  items?: ShoppingCartItem[];

  constructor(data?: Partial<ShoppingCart>) {
    super(data);
  }
}
