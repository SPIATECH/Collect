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
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {DeviceType} from '../models';
import {DeviceTypeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class DeviceTypeController {
  constructor(
    @repository(DeviceTypeRepository)
    public deviceTypeRepository: DeviceTypeRepository,
  ) {}

  @post('/device-types', {
    responses: {
      '200': {
        description: 'DeviceType model instance',
        content: {'application/json': {schema: getModelSchemaRef(DeviceType)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DeviceType, {
            title: 'NewDeviceType',
          }),
        },
      },
    })
    deviceType: DeviceType,
  ): Promise<DeviceType> {
    return this.deviceTypeRepository.create(deviceType);
  }

  @get('/device-types/count', {
    responses: {
      '200': {
        description: 'DeviceType model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(DeviceType))
    where?: Where<DeviceType>,
  ): Promise<Count> {
    return this.deviceTypeRepository.count(where);
  }

  @get('/device-types', {
    responses: {
      '200': {
        description: 'Array of DeviceType model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DeviceType, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(DeviceType))
    filter?: Filter<DeviceType>,
  ): Promise<DeviceType[]> {
    return this.deviceTypeRepository.find(filter);
  }

  @patch('/device-types', {
    responses: {
      '200': {
        description: 'DeviceType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DeviceType, {partial: true}),
        },
      },
    })
    deviceType: DeviceType,
    @param.query.object('where', getWhereSchemaFor(DeviceType))
    where?: Where<DeviceType>,
  ): Promise<Count> {
    return this.deviceTypeRepository.updateAll(deviceType, where);
  }

  @get('/device-types/{id}', {
    responses: {
      '200': {
        description: 'DeviceType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DeviceType, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(DeviceType))
    filter?: Filter<DeviceType>,
  ): Promise<DeviceType> {
    return this.deviceTypeRepository.findById(id, filter);
  }

  @patch('/device-types/{id}', {
    responses: {
      '204': {
        description: 'DeviceType PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DeviceType, {partial: true}),
        },
      },
    })
    deviceType: DeviceType,
  ): Promise<void> {
    await this.deviceTypeRepository.updateById(id, deviceType);
  }

  @put('/device-types/{id}', {
    responses: {
      '204': {
        description: 'DeviceType PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() deviceType: DeviceType,
  ): Promise<void> {
    await this.deviceTypeRepository.replaceById(id, deviceType);
  }

  @del('/device-types/{id}', {
    responses: {
      '204': {
        description: 'DeviceType DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.deviceTypeRepository.deleteById(id);
  }

  @del('/device-type/all', {
    responses: {
      '204': {
        description: 'Alert DELETE ALL success',
      },
    },
  })
  async deleteAll(): Promise<void> {
    await this.deviceTypeRepository.deleteAll();
  }
}
