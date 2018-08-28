// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ShoppingCartRepository} from '../../src/repositories';
import {ShoppingCart} from '../../src/models';
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
    expect(result).to.eql(cart1);
    result = await repo.get(cart2.userId);
    expect(result).to.eql(cart2);
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
});

function givenShoppingCart1() {
  return new ShoppingCart({
    userId: 'u01',
    items: [
      {
        productId: 'p1',
        quantity: 10,
        price: 100,
      },
    ],
  });
}

function givenShoppingCart2() {
  return new ShoppingCart({
    userId: 'u02',
    items: [
      {
        productId: 'p1',
        quantity: 1,
        price: 10,
      },
      {
        productId: 'p2',
        quantity: 5,
        price: 20,
      },
    ],
  });
}
