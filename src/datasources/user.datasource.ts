// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {juggler, AnyObject} from '@loopback/repository';
const config = require('./user.datasource.json');

export class UserDataSource extends juggler.DataSource {
  static dataSourceName = 'user';

  constructor(
    @inject('datasources.config.user', {optional: true})
    dsConfig: AnyObject = config,
  ) {
    super(dsConfig);
  }
}
