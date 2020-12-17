// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Model, model, property} from '@loopback/repository';

@model()
export class EmailTemplate extends Model {
  @property({
    type: 'string',
  })
  from = 'no_reply@loopback.io';

  @property({
    type: 'string',
    required: true,
  })
  to: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

  @property({
    type: 'string',
    required: true,
  })
  text: string;

  @property({
    type: 'string',
    required: true,
  })
  html: string;

  constructor(data?: Partial<EmailTemplate>) {
    super(data);
  }
}

export interface EmailTemplateRelations {
  // describe navigational properties here
}

export type EmailTemplateWithRelations = EmailTemplate & EmailTemplateRelations;
