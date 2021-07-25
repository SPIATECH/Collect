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
import {DeviceType, Device} from '../models';
import {DeviceTypeRepository} from '../repositories';

export class DeviceTypeDeviceController {
  constructor(
    @repository(DeviceTypeRepository)
    protected deviceTypeRepository: DeviceTypeRepository,
  ) {}

  @get('/device-types/{id}/devices', {
    responses: {
      '200': {
        description: 'Array of DeviceType has many Device',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Device)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Device>,
  ): Promise<Device[]> {
    return this.deviceTypeRepository.devices(id).find(filter);
  }

  @post('/device-types/{id}/devices', {
    responses: {
      '200': {
        description: 'DeviceType model instance',
        content: {'application/json': {schema: getModelSchemaRef(Device)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof DeviceType.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {
            title: 'NewDeviceInDeviceType',
            exclude: ['id'],
            optional: ['deviceTypeId'],
          }),
        },
      },
    })
    device: Omit<Device, 'id'>,
  ): Promise<Device> {
    return this.deviceTypeRepository.devices(id).create(device);
  }

  @patch('/device-types/{id}/devices', {
    responses: {
      '200': {
        description: 'DeviceType.Device PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Device, {partial: true}),
        },
      },
    })
    device: Partial<Device>,
    @param.query.object('where', getWhereSchemaFor(Device))
    where?: Where<Device>,
  ): Promise<Count> {
    return this.deviceTypeRepository.devices(id).patch(device, where);
  }

  @del('/device-types/{id}/devices', {
    responses: {
      '200': {
        description: 'DeviceType.Device DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Device))
    where?: Where<Device>,
  ): Promise<Count> {
    return this.deviceTypeRepository.devices(id).delete(where);
  }
}
