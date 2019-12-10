// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import express from 'express';
const recommendations = require('../data/recommendations.json');
import {HttpServer} from '@loopback/http-server';
import {ParamsDictionary} from 'express-serve-static-core';

export function createRecommendationServer(
  port = 3001,
  host: string | undefined = undefined,
) {
  const app = express();

  app.get('/:userId', (req: express.Request, res: express.Response) => {
    let userId = (req.params as ParamsDictionary).userId || 'user001';
    if (!(userId in recommendations)) {
      userId = 'user001';
    }
    res.send(recommendations[userId] || []);
  });

  return new HttpServer(app, {port, host});
}

export async function restMain(
  port = 3001,
  host: string | undefined = undefined,
) {
  const server = createRecommendationServer(port, host);
  await server.start();
  console.log('Recommendation REST server is running at ' + server.url + '.');
  return server;
}
