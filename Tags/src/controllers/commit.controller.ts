//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {post} from '@loopback/rest';
// import {inject} from '@loopback/context';
import {
  AlertRepository,
  TagGroupRepository,
  DeviceTypeRepository,
} from '../repositories';
import {repository} from '@loopback/repository';

export class CommitController {
  constructor(
    @repository(AlertRepository)
    public alertRepository: AlertRepository,
    @repository(TagGroupRepository)
    public tagGroupRepository: TagGroupRepository,
    @repository(DeviceTypeRepository)
    public deviceTypeRepository: DeviceTypeRepository,
  ) {}

  @post('/commit', {
    responses: {
      '204': {
        description: 'Commmit Success',
      },
    },
  })
  async commit(): Promise<void> {
    await this.alertRepository.commit();

    await this.tagGroupRepository.commit();

    await this.deviceTypeRepository.commit();
  }
}
