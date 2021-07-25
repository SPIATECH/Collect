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
import {Device, Tag} from '../models';
import {DeviceRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class DeviceTagController {
  constructor(
    @repository(DeviceRepository) protected deviceRepository: DeviceRepository,
  ) {}

  @get('/devices/{id}/tags', {
    responses: {
      '200': {
        description: 'Array of Device has many Tag',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.deviceRepository.tags(id).find(filter);
  }

  @post('/devices/{id}/tags', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tag)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Device.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {
            title: 'NewTagInDevice',
            exclude: ['id'],
            optional: ['deviceId'],
          }),
        },
      },
    })
    tag: Omit<Tag, 'id'>,
  ): Promise<Tag> {
    return this.deviceRepository.tags(id).create(tag);
  }

  @patch('/devices/{id}/tags', {
    responses: {
      '200': {
        description: 'Device.Tag PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {partial: true}),
        },
      },
    })
    tag: Partial<Tag>,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.deviceRepository.tags(id).patch(tag, where);
  }

  @del('/devices/{id}/tags', {
    responses: {
      '200': {
        description: 'Device.Tag DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.deviceRepository.tags(id).delete(where);
  }
}
