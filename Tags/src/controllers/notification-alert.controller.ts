//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Notification, Alert} from '../models';
import {NotificationRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class NotificationAlertController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) {}

  @get('/notifications/{id}/alert', {
    responses: {
      '200': {
        description: 'Alert belonging to Notification',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Alert)},
          },
        },
      },
    },
  })
  async getAlert(
    @param.path.string('id') id: typeof Notification.prototype.id,
  ): Promise<Alert> {
    return this.notificationRepository.alert(id);
  }
}
