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
import {TagGroup, Tag} from '../models';
import {TagGroupRepository} from '../repositories';

export class TagGroupTagController {
  constructor(
    @repository(TagGroupRepository)
    protected tagGroupRepository: TagGroupRepository,
  ) {}

  @get('/tag-groups/{id}/tags', {
    responses: {
      '200': {
        description: 'Array of TagGroup has many Tag',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tag)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.tagGroupRepository.tags(id).find(filter);
  }

  @post('/tag-groups/{id}/tags', {
    responses: {
      '200': {
        description: 'TagGroup model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tag)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof TagGroup.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {
            title: 'NewTagInTagGroup',
            exclude: ['id'],
            optional: ['tagGroupId'],
          }),
        },
      },
    })
    tag: Omit<Tag, 'id'>,
  ): Promise<Tag> {
    return this.tagGroupRepository.tags(id).create(tag);
  }

  @patch('/tag-groups/{id}/tags', {
    responses: {
      '200': {
        description: 'TagGroup.Tag PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tag, {partial: true}),
        },
      },
    })
    tag: Partial<Tag>,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.tagGroupRepository.tags(id).patch(tag, where);
  }

  @del('/tag-groups/{id}/tags', {
    responses: {
      '200': {
        description: 'TagGroup.Tag DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tag)) where?: Where<Tag>,
  ): Promise<Count> {
    return this.tagGroupRepository.tags(id).delete(where);
  }
}
