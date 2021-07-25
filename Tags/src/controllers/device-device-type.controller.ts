//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Device, DeviceType} from '../models';
import {DeviceRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class DeviceDeviceTypeController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) {}

  @get('/devices/{id}/device-type', {
    responses: {
      '200': {
        description: 'DeviceType belonging to Device',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(DeviceType)},
          },
        },
      },
    },
  })
  async getDeviceType(
    @param.path.string('id') id: typeof Device.prototype.id,
  ): Promise<DeviceType> {
    return this.deviceRepository.deviceType(id);
  }
}
