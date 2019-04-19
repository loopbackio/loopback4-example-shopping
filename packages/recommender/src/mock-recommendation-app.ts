// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as express from 'express';
const recommendations = require('../data/recommendations.json');
import {HttpServer} from '@loopback/http-server';

export function createRecommendationServer(
  port: number = 3001,
  host: string = '127.0.0.1',
) {
  const app = express();

  app.get('/:userId', (req: express.Request, res: express.Response) => {
    res.send(recommendations);
  });

  return new HttpServer(app, {port, host});
}

export async function main(port: number = 3001) {
  const server = createRecommendationServer(port);
  await server.start();
  console.log('Recommendation server is running at ' + server.url + '.');
  return server;
}
