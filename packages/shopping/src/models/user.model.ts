// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Order} from './order.model';
import {UserCredentials} from './user-credentials.model';
import {ShoppingCart} from './shopping-cart.model';

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @hasMany(() => Order)
  orders: Order[];

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @hasOne(() => ShoppingCart)
  shoppingCart: ShoppingCart;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
