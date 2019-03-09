// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ShoppingCartRepository} from '../../src/repositories';
import {ShoppingCart, ShoppingCartItem} from '../../src/models';
import {expect} from '@loopback/testlab';
import {RedisDataSource} from '../../src/datasources';

describe('ShoppingCart KeyValue Repository', () => {
  let repo: ShoppingCartRepository;
  let cart1: ShoppingCart;
  let cart2: ShoppingCart;

  before(() => {
    cart1 = givenShoppingCart1();
    cart2 = givenShoppingCart2();
    repo = new ShoppingCartRepository(new RedisDataSource());
  });

  beforeEach(async () => {
    await repo.set(cart1.userId, cart1);
    await repo.set(cart2.userId, cart2);
  });

  afterEach(async () => {
    await repo.deleteAll();
  });

  it('gets data by key', async () => {
    let result = await repo.get(cart1.userId);
    expect(result.toJSON()).to.eql(cart1.toJSON());
    result = await repo.get(cart2.userId);
    expect(result.toJSON()).to.eql(cart2.toJSON());
  });

  it('list keys', async () => {
    const keys = [];
    for await (const k of repo.keys()) {
      keys.push(k);
    }
    expect(keys).to.containEql(cart1.userId);
    expect(keys).to.containEql(cart2.userId);
  });

  it('deletes a key', async () => {
    await repo.delete(cart1.userId);
    const result = await repo.get(cart1.userId);
    expect(result).to.be.null();
  });

  it('adds an item', async () => {
    const item = new ShoppingCartItem({
      productId: 'p3',
      quantity: 10,
      price: 200,
    });
    await repo.addItem(cart1.userId, item);
    const result = await repo.get(cart1.userId);
    expect(result.items).to.containEql(item.toJSON());
  });
});

function givenShoppingCart1() {
  return new ShoppingCart({
    userId: 'u01',
    items: [
      new ShoppingCartItem({
        productId: 'p1',
        quantity: 10,
        price: 100,
      }),
    ],
  });
}

function givenShoppingCart2() {
  return new ShoppingCart({
    userId: 'u02',
    items: [
      new ShoppingCartItem({
        productId: 'p1',
        quantity: 1,
        price: 10,
      }),
      new ShoppingCartItem({
        productId: 'p2',
        quantity: 5,
        price: 20,
      }),
    ],
  });
}
