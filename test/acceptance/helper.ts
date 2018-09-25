import {ShoppingApplication} from '../..';
import {
  createClientForHandler,
  givenHttpServerConfig,
  supertest,
} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';

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

  const server = await app.getServer(RestServer);
  const client = createClientForHandler(server.requestHandler);

  return {app, client};
}
