//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {model, property, belongsTo, hasMany} from '@loopback/repository';
import {Tag} from './tag.model';
import {Notification} from './notification.model';
import {VersionedEntity} from './versioned-entity.model';
import uuid from 'uuid';

@model()
export class Alert extends VersionedEntity {
  @property({
    type: 'string',
    id: true,
    default: () => uuid(),
  })
  id: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  enabled: boolean;

  @property({
    type: 'string',
  })
  name: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  period?: string;

  @property({
    type: 'string',
  })
  function: string;

  @property({
    type: 'string',
  })
  context: string;

  @property({
    type: 'string',
  })
  user?: string;

  @property({
    type: 'string',
  })
  deadbandvalue?: string;

  @property({
    type: 'string',
  })
  activationDelay?: string;

  @property({
    type: 'string',
  })
  unit?: string;

  @property({
    type: 'string',
  })
  FQTagName?: string;

  @property({
    type: 'object',
  })
  metadata?: object;

  @property({
    type: 'object',
  })
  alertinfo?: object;

  @belongsTo(() => Tag)
  tagId: string;

  @hasMany(() => Notification)
  notifications: Notification[];

  constructor(data?: Partial<Alert>) {
    super(data);
  }
}

export interface AlertRelations {
  // describe navigational properties here
}

export type AlertWithRelations = Alert & AlertRelations;
