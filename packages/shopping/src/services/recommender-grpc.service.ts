import {getService} from '@loopback/service-proxy';
import {inject, Provider, bind} from '@loopback/core';
import {RecommenderGrpcDataSource} from '../datasources';
import {Product} from '../models';
import {RecommenderService, recommender} from './recommender.service';

export interface RecommenderGrpc {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  recommend(req: {userId: string}): Promise<{products: Product[]}>;
}

/**
 * gRPC based recommender service
 */
@bind(recommender('grpc'))
export class RecommenderGrpcServiceProvider
  implements Provider<RecommenderService> {
  constructor(
    // recommender must match the name property in the datasource json file
    @inject('datasources.recommender_grpc')
    protected dataSource: RecommenderGrpcDataSource = new RecommenderGrpcDataSource(),
  ) {}

  async value(): Promise<RecommenderService> {
    const grpcService = await getService<RecommenderGrpc>(this.dataSource);
    const service: RecommenderService = {
      getProductRecommendations: async (userId: string) => {
        const res = await grpcService.recommend({userId});
        return res.products;
      },
    };
    return service;
  }
}
