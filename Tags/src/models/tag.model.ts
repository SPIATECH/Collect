//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property, belongsTo, hasMany} from '@loopback/repository';
import {TagGroup} from './tag-group.model';
import {Alert} from './alert.model';
import {TagType} from './tag-type.model';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';
import {Device} from './device.model';

@model({settings: {strict: false}})
export class Tag extends VersionedEntity {
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
  })
  creationTimeStamp?: string;

  @belongsTo(() => TagGroup)
  tagGroupId: string;

  @hasMany(() => Alert)
  alerts: Alert[];

  // This is kept optional for backward compatibility
  @belongsTo(() => TagType)
  tagTypeId: string;

  @belongsTo(() => Device)
  deviceId: string;

  @property({
    type: 'string',
  })
  parentFullName?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}

export interface TagRelations {
  // describe navigational properties here
}

export type TagWithRelations = Tag & TagRelations;
