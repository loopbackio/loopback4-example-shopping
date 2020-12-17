// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Model, model, property} from '@loopback/repository';

@model()
export class ResetPasswordInit extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<ResetPasswordInit>) {
    super(data);
  }
}

export interface ResetPasswordInitRelations {
  // describe navigational properties here
}

export type ResetPasswordInitWithRelations = ResetPasswordInit &
  ResetPasswordInitRelations;
