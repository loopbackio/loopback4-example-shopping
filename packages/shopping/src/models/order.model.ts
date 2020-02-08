// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ShoppingCartItem} from './shopping-cart-item.model';
import {User} from './user.model';

@model()
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  orderId?: string;

  @property({
    type: 'date',
  })
  date?: string;

  // Each order belongs to a user, indentified by its id (userId)
  @belongsTo(() => User)
  userId: string;

  @property({
    type: 'string',
  })
  fullName: string;

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
