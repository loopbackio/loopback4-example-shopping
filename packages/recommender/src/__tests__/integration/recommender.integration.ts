// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createRestAppClient, givenHttpServerConfig} from '@loopback/testlab';
import {createRecommendationServer} from '../..';
import {HttpServer} from '@loopback/http-server';

const data = require('../../../data/recommendations.json');

describe('recommender', () => {
  let server: HttpServer;
  before('starting server', async () => {
    const config = givenHttpServerConfig();
    server = createRecommendationServer(config.port, config.host);
    await server.start();
  });

  after('stopping server', async () => {
    if (server) {
      await server.stop();
    }
  });

  it('returns product recommendations', async () => {
    const client = createRestAppClient({
      restServer: server,
    });
    await client.get('/user001').expect(200, data);
  });
});
