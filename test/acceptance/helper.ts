import {ShoppingApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export interface AppWithClient {
  app: ShoppingApplication;
  client: Client;
}

export async function setupApplication(): Promise<AppWithClient> {
  const app = new ShoppingApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}
