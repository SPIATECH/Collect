//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {post} from '@loopback/rest';
import {
  AlertRepository,
  DeviceRepository,
  TagGroupRepository,
} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('spia')
export class CommitControllerController {
  constructor(
    @repository(AlertRepository)
    public alertRepository: AlertRepository,
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
    @repository(TagGroupRepository)
    public tagGroupRepo: TagGroupRepository,
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
    await this.deviceRepository.commit();
    await this.tagGroupRepo.commit();
  }
}
