// Copyright IBM Corp. 2019. All Rights Reserved.
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any;
  before(() => {
    const RecommendationService = (loadRecommendationService() as unknown) as typeof Client;
    client = new RecommendationService(
      'localhost:50051',
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
