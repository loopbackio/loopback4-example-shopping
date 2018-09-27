// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as express from 'express';
const recommendations = require('./recommendations.json');

export function createRecommendationServer(port: number = 3001) {
  const app = express();

  app.get('/:userId', (req: express.Request, res: express.Response) => {
    res.send(recommendations);
  });

  return app.listen(port, () => {
    console.log(
      `Mock Product Recommender powered by Express started on port ${port}`,
    );
  });
}
