// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject, lifeCycleObserver, ValueOrPromise} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';

const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: '',
  host: '127.0.0.1',
  port: 27017,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

function updateConfig(dsConfig: AnyObject) {
  if (process.env.KUBERNETES_SERVICE_HOST) {
    dsConfig.host = process.env.SHOPPING_APP_MONGODB_SERVICE_HOST;
    dsConfig.port = +process.env.SHOPPING_APP_MONGODB_SERVICE_PORT!;
  }
  return dsConfig;
}

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource {
  static readonly dataSourceName = config.name;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(updateConfig(dsConfig));
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
