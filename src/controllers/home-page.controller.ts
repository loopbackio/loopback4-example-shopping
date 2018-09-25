// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {get} from '@loopback/openapi-v3';
import * as fs from 'fs';
import * as path from 'path';
import {template, TemplateExecutor} from 'lodash';
import {inject} from '@loopback/context';
import {RestBindings, Response} from '@loopback/rest';
import {PackageInfo, PackageKey} from '../application';

export class HomePageController {
  render: TemplateExecutor;

  constructor(
    @inject(PackageKey) private pkg: PackageInfo,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {
    const html = fs.readFileSync(
      path.join(__dirname, '../../../public/index.html.template'),
      'utf-8',
    );
    this.render = template(html);
  }

  @get('/', {
    responses: {
      '200': {
        description: 'Home Page',
        content: {'text/html': {schema: {type: 'string'}}},
      },
    },
  })
  homePage() {
    const homePage = this.render(this.pkg);
    this.response
      .status(200)
      .contentType('html')
      .send(homePage);
  }
}
