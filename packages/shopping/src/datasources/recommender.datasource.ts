// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
const config = require('./recommender.datasource.config.json');

function updateConfig(dsConfig: AnyObject) {
  if (process.env.KUBERNETES_SERVICE_HOST) {
    const host = process.env.RECOMMENDER_REST_SERVICE_HOST ?? 'localhost';
    const port = +process.env.RECOMMENDER_REST_SERVICE_PORT_REST! || 3001;
    dsConfig.operations[0].template.url = `http://${host}:${port}/{userId}`;
  }
  return dsConfig;
}

export class RecommenderDataSource extends juggler.DataSource {
  static dataSourceName = 'recommender';

  constructor(
    @inject('datasources.config.recommender', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(updateConfig(dsConfig));
  }
}
