// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {getService} from '@loopback/service-proxy';
import {inject, Provider} from '@loopback/core';
import {RecommenderDataSource} from '../datasources/recommender.datasource';
import {Product} from '../models';

export interface RecommenderService {
  recommend(userId: string): Promise<Product[]>;
}

export class RecommenderServiceProvider
  implements Provider<RecommenderService> {
  constructor(
    @inject('datasources.recommender')
    protected datasource: RecommenderDataSource,
  ) {}

  value(): Promise<RecommenderService> {
    return getService(this.datasource);
  }
}
