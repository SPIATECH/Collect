//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class VersionedEntity extends Entity {
  @property({
    type: 'string',
    required: false,
    default: '1',
  })
  version: string;

  @property({
    type: 'string',
  })
  createdOn?: string;

  @property({
    type: 'string',
  })
  updatedOn?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<VersionedEntity>) {
    super(data);
  }
}

export interface VersionedEntityRelations {
  // describe navigational properties here
}

export type VersionedEntityWithRelations = VersionedEntity &
  VersionedEntityRelations;
