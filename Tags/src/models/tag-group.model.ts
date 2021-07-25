//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property, hasMany} from '@loopback/repository';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';
import {Tag} from './tag.model';

@model({settings: {strict: false}})
export class TagGroup extends VersionedEntity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: false,
    generated: false,
    required: false,
  })
  parentId: string;

  @property({
    type: 'string',
  })
  creationTimeStamp?: string;

  // This is kept optional for backward compatibility
  @property({
    type: 'string',
  })
  parentFullName?: string;

  @hasMany(() => Tag)
  tags: Tag[];
  @hasMany(() => TagGroup, {keyTo: 'parentId'})
  subgroups: TagGroup[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TagGroup>) {
    super(data);
  }
}

export interface TagGroupRelations {
  // describe navigational properties here
}

export type TagGroupWithRelations = TagGroup & TagGroupRelations;
