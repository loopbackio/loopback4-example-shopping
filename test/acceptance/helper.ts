import {ShoppingApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  supertest,
} from '@loopback/testlab';

export interface setupApp {
  app: ShoppingApplication;
  client: supertest.SuperTest<supertest.Test>;
}

export async function setupApplication(): Promise<setupApp> {
  const app = new ShoppingApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}
