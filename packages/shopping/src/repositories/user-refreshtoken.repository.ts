// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserRefreshtoken, UserRefreshtokenRelations} from '../models';

export class UserRefreshtokenRepository extends DefaultCrudRepository<
  UserRefreshtoken,
  typeof UserRefreshtoken.prototype.id,
  UserRefreshtokenRelations
> {
  constructor(@inject('datasources.mongo') dataSource: juggler.DataSource) {
    super(UserRefreshtoken, dataSource);
  }
}
