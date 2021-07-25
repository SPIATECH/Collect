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
import {TagGroup} from '../models';
import {TagGroupRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class TagGroupTagGroupController {
  constructor(
    @repository(TagGroupRepository)
    protected tagGroupRepository: TagGroupRepository,
  ) {}

  @get('/tag-groups/{id}/tag-groups', {
    responses: {
      '200': {
        description: "Array of TagGroup's belonging to TagGroup",
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TagGroup)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<TagGroup>,
  ): Promise<TagGroup[]> {
    return this.tagGroupRepository.subGroups(id).find(filter);
  }

  @post('/tag-groups/{id}/tag-groups', {
    responses: {
      '200': {
        description: 'TagGroup model instance',
        content: {'application/json': {schema: getModelSchemaRef(TagGroup)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof TagGroup.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagGroup, {
            title: 'NewTagGroupInTagGroup',
            exclude: ['id'],
            optional: ['parentId'],
          }),
        },
      },
    })
    tagGroup: Omit<TagGroup, 'id'>,
  ): Promise<TagGroup> {
    return this.tagGroupRepository.subGroups(id).create(tagGroup);
  }

  @patch('/tag-groups/{id}/tag-groups', {
    responses: {
      '200': {
        description: 'TagGroup.TagGroup PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagGroup, {partial: true}),
        },
      },
    })
    tagGroup: Partial<TagGroup>,
    @param.query.object('where', getWhereSchemaFor(TagGroup))
    where?: Where<TagGroup>,
  ): Promise<Count> {
    return this.tagGroupRepository.subGroups(id).patch(tagGroup, where);
  }

  @del('/tag-groups/{id}/tag-groups', {
    responses: {
      '200': {
        description: 'TagGroup.TagGroup DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(TagGroup))
    where?: Where<TagGroup>,
  ): Promise<Count> {
    return this.tagGroupRepository.subGroups(id).delete(where);
  }
}
