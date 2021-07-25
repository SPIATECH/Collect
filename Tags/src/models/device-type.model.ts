//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {property, hasMany} from '@loopback/repository';
import {VersionedEntity} from './versioned-entity.model';
import {TagType} from './tag-type.model';
import uuid from 'uuid';
import {PropertyType} from './property-type.model';
import {Device} from './device.model';

export class DeviceType extends VersionedEntity {
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
  })
  name: string;

  @property({
    type: 'string',
    default: 'DeviceType',
  })
  displayName?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  sendIndividualUpdates?: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  sendBatchUpdates?: boolean;

  @hasMany(() => TagType)
  tagTypes: TagType[];

  // Indexer property to allow additional data
  @hasMany(() => Device)
  devices: Device[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  @property({type: 'array', itemType: 'object'})
  properties?: PropertyType[];

  constructor(data?: Partial<DeviceType>) {
    super(data);
  }
}

export interface DeviceTypeRelations {
  // describe navigational properties here
}

export type DeviceTypeWithRelations = DeviceType & DeviceTypeRelations;
