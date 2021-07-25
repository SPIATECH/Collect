//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property, hasMany, belongsTo} from '@loopback/repository';
import {Tag} from './tag.model';
import {Setting} from './setting.model';
import {DeviceType} from './device-type.model';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';

@model({settings: {strict: false}})
export class Device extends VersionedEntity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  enabled: boolean;

  @hasMany(() => Tag)
  tags: Tag[];

  @hasMany(() => Setting)
  settings: Setting[];

  @belongsTo(() => DeviceType)
  deviceTypeId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Device>) {
    super(data);
  }
}

export interface DeviceRelations {
  // describe navigational properties here
}

export type DeviceWithRelations = Device & DeviceRelations;
