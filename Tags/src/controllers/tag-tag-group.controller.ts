//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Tag, TagGroup} from '../models';
import {TagRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class TagTagGroupController {
  constructor(
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) {}

  @get('/tags/{id}/tag-group', {
    responses: {
      '200': {
        description: 'TagGroup belonging to Tag',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TagGroup)},
          },
        },
      },
    },
  })
  async getTagGroup(
    @param.path.string('id') id: typeof Tag.prototype.id,
  ): Promise<TagGroup> {
    return this.tagRepository.tagGroup(id);
  }
}
