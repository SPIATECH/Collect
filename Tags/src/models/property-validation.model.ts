//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class PropertyValidation extends Model {
  @property({
    type: 'string',
  })
  validRegex?: string;

  @property({
    type: 'number',
    default: 0,
  })
  minLength?: number;

  @property({
    type: 'number',
    default: 65536,
  })
  maxLength?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PropertyValidation>) {
    super(data);
  }
}

export interface PropertyValidationRelations {
  // describe navigational properties here
}

export type PropertyValidationWithRelations = PropertyValidation &
  PropertyValidationRelations;
