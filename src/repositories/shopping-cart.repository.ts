// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DefaultKeyValueRepository} from '@loopback/repository';
import {ShoppingCart, ShoppingCartItem} from '../models';
import {RedisDataSource} from '../datasources/redis.datasource';
import {inject} from '@loopback/context';
import {promisify} from 'util';
import {Task, retry} from '../utils/retry';

export class ShoppingCartRepository extends DefaultKeyValueRepository<
  ShoppingCart
> {
  constructor(@inject('datasources.redis') ds: RedisDataSource) {
    super(ShoppingCart, ds);
  }

  /**
   * Add an item to the shopping cart with optimistic lock to allow concurrent
   * `adding to cart` from multiple devices. If race condition happens, it will
   * try 10 times at an interval of 10 ms. Timeout will be reported as an error.
   *
   * @param userId User id
   * @param item Item to be added
   * @returns A promise that's resolved with the updated ShoppingCart instance
   *
   */
  addItem(userId: string, item: ShoppingCartItem) {
    const task: Task<ShoppingCart> = {
      run: async () => {
        const addItemToCart = (cart: ShoppingCart | null) => {
          cart = cart || new ShoppingCart({userId});
          cart.items = cart.items || [];
          cart.items.push(item);
          return cart;
        };
        const result = await this.checkAndSet(userId, addItemToCart);
        return {
          done: result != null,
          value: result,
        };
      },
      description: `update the shopping cart for '${userId}'`,
    };
    return retry(task, {maxTries: 10, interval: 10});
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
   *
   * @returns A promise that's resolved with the updated ShoppingCart instance
   * or with null if the transaction failed due to a race condition.
   * See https://github.com/NodeRedis/node_redis#optimistic-locks
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
    const result = await execute('EXEC', []);
    return result == null ? null : cart;
  }
}
