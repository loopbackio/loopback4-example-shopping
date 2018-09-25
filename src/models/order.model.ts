// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';
import {ShoppingCartItem} from './shopping-cart-item.model';

@model()
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  orderId?: string;

  // TODO(virkt25): This should be a belongsTo once it is available
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'number',
  })
  total?: number;

  @property.array(ShoppingCartItem, {required: true})
  products: ShoppingCartItem[];

  constructor(data?: Partial<Order>) {
    super(data);
  }
}
