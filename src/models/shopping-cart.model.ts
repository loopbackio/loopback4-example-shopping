// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';
import {ShoppingCartItem} from './shopping-cart-item.model';

@model()
export class ShoppingCart extends Entity {
  /**
   * Each user has a unique shopping cart keyed by the user id
   */
  @property({
    type: 'string',
    id: true,
    required: true,
  })
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
