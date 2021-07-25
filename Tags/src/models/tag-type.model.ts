//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property} from '@loopback/repository';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';
import {PropertyType} from './property-type.model';

@model({settings: {strict: false}})
export class TagType extends VersionedEntity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id: string;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    default: 'DefaultTagType',
  })
  name: string;

  @property({
    type: 'string',
  })
  deviceTypeId?: string;
  // Define well-known properties here

  @property({type: 'array', itemType: 'object'})
  properties?: PropertyType[];
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TagType>) {
    super(data);
  }
}

export interface TagTypeRelations {
  // describe navigational properties here
}

export type TagTypeWithRelations = TagType & TagTypeRelations;
