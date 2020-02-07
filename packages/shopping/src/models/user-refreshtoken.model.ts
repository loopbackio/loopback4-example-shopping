// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

@model()
export class UserRefreshtoken extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'number',
    required: true,
  })
  ttl: number;

  @property({
    type: 'date',
  })
  creation: Date;

  @property({
    type: 'string',
    required: true,
    mongodb: {dataType: 'ObjectID'},
  })
  userId: string;

  constructor(data?: Partial<UserRefreshtoken>) {
    super(data);
  }
}

export interface UserRefreshtokenRelations {
  // describe navigational properties here
}

export type UserRefreshtokenWithRelations = UserRefreshtoken &
  UserRefreshtokenRelations;
