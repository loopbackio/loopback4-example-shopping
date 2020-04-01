// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Product} from '../models';
import {
  Provider,
  inject,
  BindingTemplate,
  BindingScope,
  BindingFilter,
} from '@loopback/context';
import {extensionFor, extensionFilter} from '@loopback/core';

/**
 * Interface for recommendation service
 */
export interface RecommenderService {
  getProductRecommendations(userId: string): Promise<Product[]>;
}

export const RECOMMENDER_SERVICE = 'RecommenderService';

/**
 * A binding template for recommender service extensions
 */
export function recommender(protocol: string) {
  const asRecommenderService: BindingTemplate = binding => {
    extensionFor(RECOMMENDER_SERVICE)(binding);
    binding.tag({protocol}).inScope(BindingScope.SINGLETON);
  };
  return asRecommenderService;
}

const recommenderFilter: BindingFilter = binding => {
  const protocol = process.env.RECOMMENDER_PROTOCOL ?? 'rest';
  return (
    extensionFilter(RECOMMENDER_SERVICE)(binding) &&
    binding.tagMap.protocol === protocol
  );
};

/**
 * A facade recommender service that selects RESt or gRPC protocol based on
 * the value of `RECOMMENDER_PROTOCOL` environment variable
 */
export class RecommenderServiceProvider
  implements Provider<RecommenderService> {
  constructor(
    @inject(recommenderFilter)
    private recommenderServices: RecommenderService[],
  ) {}

  value() {
    return this.recommenderServices[0];
  }
}
