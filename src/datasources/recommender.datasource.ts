// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
const config = require('./recommender.datasource.json');

export class RecommenderDataSource extends juggler.DataSource {
  static dataSourceName = 'recommender';

  constructor(
    @inject('datasources.config.recommender', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(dsConfig);
  }
}
