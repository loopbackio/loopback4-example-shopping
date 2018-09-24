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

const pkg = require('../../../package.json');

export class HomePageController {
  name: string;
  version: string;
  description: string;
  render: TemplateExecutor;

  constructor(@inject(RestBindings.Http.RESPONSE) private res: Response) {
    this.name = pkg.name;
    this.version = pkg.version;
    this.description = pkg.description || pkg.name;
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
    const homePage = this.render(this);
    this.res
      .status(200)
      .contentType('html')
      .send(homePage);
  }
}
