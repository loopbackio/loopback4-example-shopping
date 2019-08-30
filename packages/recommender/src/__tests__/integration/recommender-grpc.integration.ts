// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-recommender
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createGRPCRecommendationServer} from '../..';
import {Server, credentials, Client} from 'grpc';
import {loadRecommendationService} from '../../recommendation-grpc';
import {expect} from '@loopback/testlab';

const data = require('../../../data/recommendations.json');

describe('recommender', () => {
  let server: Server;
  before('starting server', async () => {
    server = createGRPCRecommendationServer();
    server.start();
  });

  after('stopping server', async () => {
    if (server) {
      server.forceShutdown();
    }
  });

  it('returns product recommendations', done => {
    const RecommendationService = (loadRecommendationService() as unknown) as typeof Client;
    const client = new RecommendationService(
      'localhost:50051',
      credentials.createInsecure(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;

    client.recommend({userId: 'user002'}, (err: Error, result: unknown) => {
      if (err) return done(err);
      expect(result).to.eql({products: data['user002']});
      done();
    });
  });
});
