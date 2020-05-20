// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Context} from 'mocha';
import {GenericContainer, StartedTestContainer} from 'testcontainers';

async function startRedis() {
  const container = await new GenericContainer('redis')
    .withName('redis_lb4_shopping_test')
    .withExposedPorts(6379)
    .start();
  process.env.SHOPPING_APP_REDIS_MASTER_SERVICE_HOST = container.getContainerIpAddress();
  process.env.SHOPPING_APP_REDIS_MASTER_SERVICE_PORT = container
    .getMappedPort(6379)
    .toString();
  return container;
}

async function startMongoDB() {
  const container = await new GenericContainer('mongo')
    .withName('mongodb_lb4_shopping_test')
    .withExposedPorts(27017)
    .start();
  process.env.SHOPPING_APP_MONGODB_SERVICE_HOST = container.getContainerIpAddress();
  process.env.SHOPPING_APP_MONGODB_SERVICE_PORT = container
    .getMappedPort(27017)
    .toString();
  return container;
}

let redis: StartedTestContainer;
let mongo: StartedTestContainer;

/**
 * Root-level before hook to start Redis/Mongo containers
 */
before(async function (this: Context) {
  // Skip it for CI as there are services for redis/mongodb
  if (process.env.CI) return;
  process.env.KUBERNETES_SERVICE_HOST = 'localhost';
  this.timeout(30 * 1000);
  redis = await startRedis();
  mongo = await startMongoDB();
});

/**
 * Root-level before hook to stop Redis/Mongo containers
 */
after(async function (this: Context) {
  if (process.env.CI) return;
  this.timeout(30 * 1000);
  if (mongo) await mongo.stop();
  if (redis) await redis.stop();
});
