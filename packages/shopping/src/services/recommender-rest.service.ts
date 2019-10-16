// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {getService} from '@loopback/service-proxy';
import {inject, Provider, bind} from '@loopback/core';
import {RecommenderDataSource} from '../datasources/recommender.datasource';
import {RecommenderService, recommender} from './recommender.service';

/**
 * Rest based recommender service
 */
@bind(recommender('rest'))
export class RecommenderRestServiceProvider
  implements Provider<RecommenderService> {
  constructor(
    @inject('datasources.recommender')
    protected datasource: RecommenderDataSource,
  ) {}

  value(): Promise<RecommenderService> {
    return getService(this.datasource);
  }
}
