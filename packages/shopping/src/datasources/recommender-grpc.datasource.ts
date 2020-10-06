// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
import path from 'path';

const config = {
  name: 'recommender_grpc',
  connector: 'loopback-connector-grpc',
  url: '127.0.0.1:50000',
  spec: 'protos/recommendation.proto',
};

function updateConfig(dsConfig: AnyObject) {
  if (
    process.env.KUBERNETES_SERVICE_HOST &&
    process.env.RECOMMENDER_GRPC_SERVICE_HOST
  ) {
    const host = process.env.RECOMMENDER_GRPC_SERVICE_HOST;
    const port = +process.env.RECOMMENDER_GRPC_SERVICE_PORT_GRPC!;

    dsConfig.url = `${host}:${port}`;
  }
  return dsConfig;
}

export class RecommenderGrpcDataSource extends juggler.DataSource {
  static readonly dataSourceName = config.name;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.recommender_grpc', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super({
      ...updateConfig(dsConfig),
      spec: RecommenderGrpcDataSource.getProtoFile(),
    });
  }

  private static getProtoFile() {
    return path.resolve(__dirname, '../../protos/recommendation.proto');
  }
}
