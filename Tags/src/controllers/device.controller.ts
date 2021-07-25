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
import {Device} from '../models';
import {DeviceRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {intercept} from '@loopback/core';
import {DevicePropertyValidatorInterceptor} from '../interceptors';

@authenticate('spia')
@intercept(DevicePropertyValidatorInterceptor.BINDING_KEY)
export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) {}

  @post('/devices', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: getModelSchemaRef(Device)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {
            title: 'NewDevice',
            exclude: ['id'],
          }),
        },
      },
    })
    device: Omit<Device, 'id'>,
  ): Promise<Device> {
    return this.deviceRepository.create(device);
  }

  @get('/devices/count', {
    responses: {
      '200': {
        description: 'Device model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Device))
    where?: Where<Device>,
  ): Promise<Count> {
    return this.deviceRepository.count(where);
  }

  @get('/devices', {
    responses: {
      '200': {
        description: 'Array of Device model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Device, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Device))
    filter?: Filter<Device>,
  ): Promise<Device[]> {
    return this.deviceRepository.find(filter);
  }

  @patch('/devices', {
    responses: {
      '200': {
        description: 'Device PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {partial: true}),
        },
      },
    })
    device: Device,
    @param.query.object('where', getWhereSchemaFor(Device))
    where?: Where<Device>,
  ): Promise<Count> {
    return this.deviceRepository.updateAll(device, where);
  }

  @get('/devices/{id}', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Device, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Device))
    filter?: Filter<Device>,
  ): Promise<Device> {
    return this.deviceRepository.findById(id, filter);
  }

  @patch('/devices/{id}', {
    responses: {
      '204': {
        description: 'Device PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {partial: true}),
        },
      },
    })
    device: Device,
  ): Promise<void> {
    await this.deviceRepository.updateById(id, device);
  }

  @put('/devices/{id}', {
    responses: {
      '204': {
        description: 'Device PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() device: Device,
  ): Promise<void> {
    await this.deviceRepository.replaceById(id, device);
  }

  @del('/devices/{id}', {
    responses: {
      '204': {
        description: 'Device DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.deviceRepository.deleteById(id);
  }

  @del('/devices/all', {
    responses: {
      '204': {
        description: 'DEVICE DELETE ALL success',
      },
    },
  })
  async deleteAll(
    @param.query.object('where', getWhereSchemaFor(Device))
    where?: Where<Device>,
  ): Promise<void> {
    await this.deviceRepository.deleteAll(where);
  }

  @post('/devices/commit', {
    responses: {
      '204': {
        description: 'Commmit Success',
      },
    },
  })
  @authenticate('spia')
  async commit(): Promise<void> {
    await this.deviceRepository.commit();
  }
}
