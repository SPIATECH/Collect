//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {Model, model, property} from '@loopback/repository';
import {PropertyValidation} from './property-validation.model';

@model({settings: {strict: false}})
export class PropertyType extends Model {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: false,
  })
  displayName: string;

  @property({
    type: 'string',
    required: false,
  })
  default: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  required: boolean;

  @property({type: 'array', itemType: 'object'})
  validations?: PropertyValidation[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PropertyType>) {
    super(data);
  }
}

export interface PropertyDefRelations {
  // describe navigational properties here
}

export type PropertyDefWithRelations = PropertyType & PropertyDefRelations;
