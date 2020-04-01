// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
import path from 'path';

const config = require('./recommender-grpc.datasource.config.json');

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
  static dataSourceName = 'recommender_grpc';

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
