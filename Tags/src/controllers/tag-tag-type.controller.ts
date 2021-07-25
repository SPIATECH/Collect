//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Tag, TagType} from '../models';
import {TagRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class TagTagTypeController {
  constructor(
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) {}

  @get('/tags/{id}/tag-type', {
    responses: {
      '200': {
        description: 'TagType belonging to Tag',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TagType)},
          },
        },
      },
    },
  })
  async getTagType(
    @param.path.string('id') id: typeof Tag.prototype.id,
  ): Promise<TagType> {
    return this.tagRepository.tagType(id);
  }
}
