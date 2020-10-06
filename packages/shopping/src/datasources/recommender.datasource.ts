// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';

const config = {
  name: 'recommender',
  connector: 'rest',
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
      contentType: 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3001/{userId}',
      },
      functions: {
        getProductRecommendations: ['userId'],
      },
    },
  ],
};

function updateConfig(dsConfig: AnyObject) {
  if (process.env.KUBERNETES_SERVICE_HOST) {
    const host = process.env.RECOMMENDER_REST_SERVICE_HOST ?? 'localhost';
    const port = +process.env.RECOMMENDER_REST_SERVICE_PORT_REST! || 3001;
    dsConfig.operations[0].template.url = `http://${host}:${port}/{userId}`;
  }
  return dsConfig;
}

export class RecommenderDataSource extends juggler.DataSource {
  static readonly dataSourceName = config.name;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.recommender', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(updateConfig(dsConfig));
  }
}
