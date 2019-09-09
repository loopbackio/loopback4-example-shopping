// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ShoppingApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {RestBindings} from '@loopback/rest';
import {addSecuritychema} from './utils/security-spec';
export {ShoppingApplication, PackageInfo, PackageKey} from './application';

export async function main(options?: ApplicationConfig) {
  const app = new ShoppingApplication(options);

  await app.boot();
  let oaiSchema = app.getSync(RestBindings.API_SPEC);
  addSecuritychema(oaiSchema);
  console.log(oaiSchema.components!.securitySchemes);
  app.bind(RestBindings.API_SPEC).to(oaiSchema);
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
