import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './recommender-grpc.datasource.json';
import * as path from 'path';

export class RecommenderGrpcDataSource extends juggler.DataSource {
  static dataSourceName = 'recommender_grpc';

  constructor(
    @inject('datasources.config.recommender_grpc', {optional: true})
    dsConfig: object = config,
  ) {
    super({...dsConfig, spec: RecommenderGrpcDataSource.getProtoFile()});
  }

  private static getProtoFile() {
    return path.resolve(__dirname, '../../protos/recommendation.proto');
  }
}
