//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property} from '@loopback/repository';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';

@model()
export class Setting extends VersionedEntity {
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
  key: string;

  @property({
    type: 'string',
  })
  value?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  serialized?: boolean;

  @property({
    type: 'string',
  })
  sertype?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  deviceId?: string;

  @property({
    type: 'string',
  })
  tagId?: string;

  @property({
    type: 'string',
  })
  tagGroupId?: string;

  constructor(data?: Partial<Setting>) {
    super(data);
  }
}

export interface SettingRelations {
  // describe navigational properties here
}

export type SettingWithRelations = Setting & SettingRelations;
