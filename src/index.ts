import {ShoppingApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ShoppingApplication};

export async function main(options?: ApplicationConfig) {
  const app = new ShoppingApplication(options);
  await app.boot();
  await app.start();
  return app;
}
