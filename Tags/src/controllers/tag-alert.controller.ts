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
import {Tag, Alert} from '../models';
import {TagRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class TagAlertController {
  constructor(
    @repository(TagRepository) protected tagRepository: TagRepository,
  ) {}

  @get('/tags/{id}/alerts', {
    responses: {
      '200': {
        description: "Array of Alert's belonging to Tag",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Alert)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Alert>,
  ): Promise<Alert[]> {
    return this.tagRepository.alerts(id).find(filter);
  }

  @post('/tags/{id}/alerts', {
    responses: {
      '200': {
        description: 'Tag model instance',
        content: {'application/json': {schema: getModelSchemaRef(Alert)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Tag.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alert, {
            title: 'NewAlertInTag',
            exclude: ['id'],
            optional: ['tagId'],
          }),
        },
      },
    })
    alert: Omit<Alert, 'id'>,
  ): Promise<Alert> {
    return this.tagRepository.alerts(id).create(alert);
  }

  @patch('/tags/{id}/alerts', {
    responses: {
      '200': {
        description: 'Tag.Alert PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alert, {partial: true}),
        },
      },
    })
    alert: Partial<Alert>,
    @param.query.object('where', getWhereSchemaFor(Alert)) where?: Where<Alert>,
  ): Promise<Count> {
    return this.tagRepository.alerts(id).patch(alert, where);
  }

  @del('/tags/{id}/alerts', {
    responses: {
      '200': {
        description: 'Tag.Alert DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Alert)) where?: Where<Alert>,
  ): Promise<Count> {
    return this.tagRepository.alerts(id).delete(where);
  }
}
