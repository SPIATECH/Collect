//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property, belongsTo} from '@loopback/repository';
import {Alert} from './alert.model';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';

@model({settings: {strict: false}})
export class Notification extends VersionedEntity {
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
    type: 'boolean',
    required: true,
    default: true,
  })
  enabled: boolean;

  @property({
    type: 'object',
  })
  email?: object;

  @property({
    type: 'object',
  })
  sms?: object;

  @belongsTo(() => Alert)
  alertId: string;
  // Define well-known properties here

  @property({
    type: 'boolean',
    default: true,
  })
  recoveryalert?: boolean;

  @property({
    type: 'string',
  })
  creationTimeStamp?: string;

  @property({
    type: 'string',
  })
  updationTimeStamp?: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  // describe navigational properties here
}

export type NotificationWithRelations = Notification & NotificationRelations;
