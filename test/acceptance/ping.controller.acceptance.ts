// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createClientForHandler, supertest, expect} from '@loopback/testlab';
import {RestServer} from '@loopback/rest';
import {ShoppingApplication} from '../..';

describe('PingController', () => {
  let app: ShoppingApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;

  before(givenAnApplication);

  before(givenARestServer);

  before(async () => {
    await app.boot();
    await app.start();
  });

  before(() => {
    client = createClientForHandler(server.requestHandler);
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });

  it('exposes OpenAPI spec at /openapi.json', async () => {
    const res = await client.get('/openapi.json').expect(200);
    expect(res.body).to.containDeep({
      paths: {
        '/ping': {
          get: {
            'x-controller-name': 'PingController',
            'x-operation-name': 'ping',
            tags: ['PingController'],
            responses: {
              '200': {
                description: 'Ping Response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        greeting: {type: 'string'},
                        date: {type: 'string'},
                        url: {type: 'string'},
                        headers: {
                          type: 'object',
                          patternProperties: {
                            '^.*$': {type: 'string'},
                          },
                          additionalProperties: false,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  function givenAnApplication() {
    app = new ShoppingApplication({
      rest: {
        port: 0,
      },
    });
  }

  async function givenARestServer() {
    server = await app.getServer(RestServer);
  }
});
