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
import {DeviceType, TagType} from '../models';
import {DeviceTypeRepository} from '../repositories';

export class DeviceTypeTagTypeController {
  constructor(
    @repository(DeviceTypeRepository)
    protected deviceTypeRepository: DeviceTypeRepository,
  ) {}

  @get('/device-types/{id}/tag-types', {
    responses: {
      '200': {
        description: 'Array of DeviceType has many TagType',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TagType)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TagType>,
  ): Promise<TagType[]> {
    return this.deviceTypeRepository.tagTypes(id).find(filter);
  }

  @post('/device-types/{id}/tag-types', {
    responses: {
      '200': {
        description: 'DeviceType model instance',
        content: {'application/json': {schema: getModelSchemaRef(TagType)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DeviceType.prototype.name,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagType, {
            title: 'NewTagTypeInDeviceType',
            exclude: ['name'],
            optional: ['deviceTypeId'],
          }),
        },
      },
    })
    tagType: Omit<TagType, 'name'>,
  ): Promise<TagType> {
    return this.deviceTypeRepository.tagTypes(id).create(tagType);
  }

  @patch('/device-types/{id}/tag-types', {
    responses: {
      '200': {
        description: 'DeviceType.TagType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagType, {partial: true}),
        },
      },
    })
    tagType: Partial<TagType>,
    @param.query.object('where', getWhereSchemaFor(TagType))
    where?: Where<TagType>,
  ): Promise<Count> {
    return this.deviceTypeRepository.tagTypes(id).patch(tagType, where);
  }

  @del('/device-types/{id}/tag-types', {
    responses: {
      '200': {
        description: 'DeviceType.TagType DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TagType))
    where?: Where<TagType>,
  ): Promise<Count> {
    return this.deviceTypeRepository.tagTypes(id).delete(where);
  }
}
