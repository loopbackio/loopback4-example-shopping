// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import path from 'path';
import {
  loadPackageDefinition,
  GrpcObject,
  handleUnaryCall,
  Server,
  ServiceDefinition,
  ServerCredentials,
} from 'grpc';

import {loadSync} from '@grpc/proto-loader';

const recommendations = require('../data/recommendations.json');

export const PROTO_PATH = path.join(
  __dirname,
  '../protos/recommendation.proto',
);

export function loadRecommendationService() {
  const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const pkg = loadPackageDefinition(packageDefinition);
  const recommendation = (pkg.recommendation as GrpcObject)
    .RecommendationService as GrpcObject;
  return recommendation;
}

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return The new server object
 */
export function createGRPCRecommendationServer(port = '0.0.0.0:50051') {
  const server = new Server();
  const recommendation = loadRecommendationService();

  const recommend: handleUnaryCall<{userId: string}, unknown> = (
    call,
    callback,
  ) => {
    let userId = call.request.userId || 'user001';
    if (!(userId in recommendations)) {
      userId = 'user001';
    }
    callback(null, {products: recommendations[userId] || []});
  };

  server.addService(recommendation.service as ServiceDefinition<unknown>, {
    recommend,
  });

  server.bind(port, ServerCredentials.createInsecure());
  return server;
}

export function grpcMain(port = '0.0.0.0:50051') {
  const recommendationServer = createGRPCRecommendationServer(port);
  recommendationServer.start();
  console.log(`Recommendation gRPC server is running at ${port}.`);
  return recommendationServer;
}

if (require.main === module) {
  grpcMain();
}
