// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

/**
 * Item in a shopping cart
 */
@model()
export class ShoppingCartItem {
  /**
   * Product id
   */
  @property()
  productId: string;
  /**
   * Quantity
   */
  @property()
  quantity: number;
  /**
   * Price
   */
  @property()
  price?: number;
}

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
  @property({
    type: 'array',
    itemType: ShoppingCartItem,
  })
  items?: ShoppingCartItem[];

  constructor(data?: Partial<ShoppingCart>) {
    super(data);
  }
}
