//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {Alert, Notification} from '../models';
import {AlertRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class AlertNotificationController {
  constructor(
    @repository(AlertRepository) protected alertRepository: AlertRepository,
  ) {}

  @get('/alerts/{id}/notifications', {
    responses: {
      '200': {
        description: "Array of Notification's belonging to Alert",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Notification)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    return this.alertRepository.notifications(id).find(filter);
  }

  @post('/alerts/{id}/notifications', {
    responses: {
      '200': {
        description: 'Alert model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Alert.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotificationInAlert',
            exclude: ['id'],
            optional: ['alertId'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    return this.alertRepository.notifications(id).create(notification);
  }

  @patch('/alerts/{id}/notifications', {
    responses: {
      '200': {
        description: 'Alert.Notification PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Partial<Notification>,
    @param.query.object('where', getWhereSchemaFor(Notification))
    where?: Where<Notification>,
  ): Promise<Count> {
    return this.alertRepository.notifications(id).patch(notification, where);
  }

  @del('/alerts/{id}/notifications', {
    responses: {
      '200': {
        description: 'Alert.Notification DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Notification))
    where?: Where<Notification>,
  ): Promise<Count> {
    return this.alertRepository.notifications(id).delete(where);
  }
}
