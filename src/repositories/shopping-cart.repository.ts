// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DefaultKeyValueRepository} from '@loopback/repository';
import {ShoppingCart, ShoppingCartItem} from '../models/shopping-cart.model';
import {RedisDataSource} from '../datasources/redis.datasource';
import {inject} from '@loopback/context';
import {promisify} from 'util';

export class ShoppingCartRepository extends DefaultKeyValueRepository<
  ShoppingCart
> {
  constructor(@inject('datasources.redis') ds: RedisDataSource) {
    super(ShoppingCart, ds);
  }

  /**
   * Add an item to the shopping cart with optimistic lock to allow concurrent
   * `adding to cart` from multiple devices
   *
   * @param userId User id
   * @param item Item to be added
   */
  addItem(userId: string, item: ShoppingCartItem) {
    const addItemToCart = (cart: ShoppingCart | null) => {
      cart = cart || new ShoppingCart({userId});
      cart.items = cart.items || [];
      cart.items.push(item);
      return cart;
    };
    return this.checkAndSet(userId, addItemToCart);
  }

  /**
   * Use Redis WATCH and Transaction to check and set against a key
   * See https://redis.io/topics/transactions#optimistic-locking-using-check-and-set
   *
   * Ideally, this method should be made available by `KeyValueRepository`.
   *
   * @param userId User id
   * @param check A function that checks the current value and produces a new
   * value. It returns `null` to abort.
   */
  async checkAndSet(
    userId: string,
    check: (current: ShoppingCart | null) => ShoppingCart | null,
  ) {
    const connector = this.kvModelClass.dataSource!.connector!;
    // tslint:disable-next-line:no-any
    const execute = promisify((cmd: string, args: any[], cb: Function) => {
      return connector.execute!(cmd, args, cb);
    });
    /**
     * - WATCH userId
     * - GET userId
     * - check(cart)
     * - MULTI
     * - SET userId
     * - EXEC
     */
    await execute('WATCH', [userId]);
    let cart: ShoppingCart | null = await this.get(userId);
    cart = check(cart);
    if (!cart) return null;
    await execute('MULTI', []);
    await this.set(userId, cart);
    await execute('EXEC', []);
    return cart;
  }
}
