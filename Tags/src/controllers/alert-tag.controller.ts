//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Alert, Tag} from '../models';
import {AlertRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class AlertTagController {
  constructor(
    @repository(AlertRepository)
    public alertRepository: AlertRepository,
  ) {}

  @get('/alerts/{id}/tag', {
    responses: {
      '200': {
        description: 'Tag belonging to Alert',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  async getTag(
    @param.path.string('id') id: typeof Alert.prototype.id,
  ): Promise<Tag> {
    return this.alertRepository.tag(id);
  }
}
