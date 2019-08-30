// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export * from './recommendation-rest';
export * from './recommendation-grpc';
export * from '@loopback/http-server';

import {restMain} from './recommendation-rest';
import {grpcMain} from './recommendation-grpc';

export async function main(
  config: {
    rest?: {host?: string; port?: number};
    grpc?: {port?: string};
  } = {rest: {port: 3001}, grpc: {}},
) {
  if (config.rest) {
    await restMain(config.rest.port, config.rest.host);
  }
  if (config.grpc) {
    grpcMain(config.grpc.port);
  }
}
