// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as express from 'express';
import {Server} from 'http';
const recommednations = require('./recommendations.json');

const app = express();

app.get('/:userId', (req: express.Request, res: express.Response) => {
  res.send(recommednations);
});

let server: Server;

export const recommender = {
  start: () => {
    server = app.listen(3001, () => {
      console.log(
        'Mock Product Recommender powered by Express started on port 3001',
      );
    });
  },

  stop: () => {
    return server.close();
  },
};
