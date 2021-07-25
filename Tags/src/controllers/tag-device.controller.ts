//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Tag, Device} from '../models';
import {TagRepository} from '../repositories';

export class TagDeviceController {
  constructor(
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) {}

  @get('/tags/{id}/device', {
    responses: {
      '200': {
        description: 'Device belonging to Tag',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Device)},
          },
        },
      },
    },
  })
  async getDevice(
    @param.path.string('id') id: typeof Tag.prototype.id,
  ): Promise<Device> {
    return this.tagRepository.device(id);
  }
}
