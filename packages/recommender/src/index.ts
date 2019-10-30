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
  // Enable the protocol by env var `RECOMMENDER_PROTOCOL`
  // If not set, both protocols are enabled
  const protocol = process.env.RECOMMENDER_PROTOCOL;
  if (config.rest) {
    if (protocol == null || protocol === 'rest')
      await restMain(config.rest.port, config.rest.host);
  }
  if (config.grpc) {
    if (protocol == null || protocol === 'grpc') grpcMain(config.grpc.port);
  }
}
