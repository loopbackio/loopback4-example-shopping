// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

/**
 * Item in a shopping cart
 */
@model()
export class ShoppingCartItem extends Entity {
  /**
   * Product id
   */
  @property({id: true})
  productId: string;

  /**
   * Product name
   */
  @property()
  name: string;

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

  constructor(data?: Partial<ShoppingCartItem>) {
    super(data);
  }
}
