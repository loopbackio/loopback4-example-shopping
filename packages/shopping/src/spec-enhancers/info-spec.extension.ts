// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {bind, Context, inject} from '@loopback/context';
import {
  asSpecEnhancer,
  mergeOpenAPISpec,
  OASEnhancer,
  OpenApiSpec,
} from '@loopback/openapi-v3';
import {PackageInfo, PackageKey} from '../application';

@bind(asSpecEnhancer)
export class InfoSpecEnhancer implements OASEnhancer {
  name = 'info';
  pkg: PackageInfo;

  constructor(@inject.context() private ctx: Context) {
    this.pkg = ctx.getSync<PackageInfo>(PackageKey);
  }

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const patchSpec = {
      openapi: '3.0.0',
      info: {
        title: this.pkg.name,
        version: this.pkg.version,
        contact: {},
      },
      servers: [{url: '/'}],
    };

    return mergeOpenAPISpec(spec, patchSpec);
  }
}
