// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, credentials, Server} from '@grpc/grpc-js';
import {expect} from '@loopback/testlab';
import {createGRPCRecommendationServer} from '../..';
import {loadRecommendationService} from '../../recommendation-grpc';

const data = require('../../../data/recommendations.json');

describe('recommender', () => {
  let server: Server;
  let port: number;

  before('starting server', async () => {
    const result = await createGRPCRecommendationServer();
    server = result.server;
    port = result.port;
    server.start();
  });

  after('stopping server', async () => {
    if (server) {
      server.forceShutdown();
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any;
  before(() => {
    const RecommendationService = (loadRecommendationService() as unknown) as typeof Client;
    client = new RecommendationService(
      `localhost:${port}`,
      credentials.createInsecure(),
    );
  });

  it('returns product recommendations for user002', done => {
    client.recommend({userId: 'user002'}, (err: Error, result: unknown) => {
      if (err) return done(err);
      expect(result).to.eql({products: data['user002']});
      done();
    });
  });

  it('returns product recommendations for other users', done => {
    client.recommend({userId: 'user004'}, (err: Error, result: unknown) => {
      if (err) return done(err);
      // Fallback to user001's list
      expect(result).to.eql({products: data['user001']});
      done();
    });
  });
});
