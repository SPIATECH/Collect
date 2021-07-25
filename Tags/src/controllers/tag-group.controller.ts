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
import {TagGroup} from '../models';
import {TagGroupRepository} from '../repositories';

import {TagRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class TagGroupController {
  constructor(
    @repository(TagGroupRepository)
    public tagGroupRepository: TagGroupRepository,
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) {}

  @post('/tag-groups', {
    responses: {
      '200': {
        description: 'TagGroup model instance',
        content: {'application/json': {schema: getModelSchemaRef(TagGroup)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagGroup, {
            title: 'NewTagGroup',
          }),
        },
      },
    })
    tagGroup: TagGroup,
  ): Promise<TagGroup> {
    return this.tagGroupRepository.create(tagGroup);
  }

  @get('/tag-groups/count', {
    responses: {
      '200': {
        description: 'TagGroup model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TagGroup))
    where?: Where<TagGroup>,
  ): Promise<Count> {
    return this.tagGroupRepository.count(where);
  }

  @get('/tag-groups', {
    responses: {
      '200': {
        description: 'Array of TagGroup model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TagGroup, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  // @intercept(logger)
  async find(
    @param.query.object('filter', getFilterSchemaFor(TagGroup))
    filter?: Filter<TagGroup>,
  ): Promise<TagGroup[]> {
    return this.tagGroupRepository.find(filter);
  }

  @get('/all-tag-groups/{id}', {
    responses: {
      '200': {
        description: 'Array of TagGroup model instances with subgroups',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TagGroup, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findAllWithRelation(
    @param.path.string('id') id: string,
  ): Promise<TagGroup[]> {
    return this.tagGroupRepository.find({
      include: [{relation: 'subgroups'}],
      where: {parentId: id},
    });
  }

  @get('/all-tag-groups-top-level', {
    responses: {
      '200': {
        description:
          'Array of Top Level TagGroup model instances with subgroups',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TagGroup, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findAllWithRelationTopLevel(): Promise<TagGroup[]> {
    return this.tagGroupRepository.find({
      include: [{relation: 'subgroups'}],
      where: {parentId: '00000000-0000-0000-0000-000000000000'},
    });
  }

  @patch('/tag-groups', {
    responses: {
      '200': {
        description: 'TagGroup PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagGroup, {partial: true}),
        },
      },
    })
    tagGroup: TagGroup,
    @param.query.object('where', getWhereSchemaFor(TagGroup))
    where?: Where<TagGroup>,
  ): Promise<Count> {
    return this.tagGroupRepository.updateAll(tagGroup, where);
  }

  @get('/tag-groups/{id}', {
    responses: {
      '200': {
        description: 'TagGroup model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TagGroup, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TagGroup))
    filter?: Filter<TagGroup>,
  ): Promise<TagGroup> {
    return this.tagGroupRepository.findById(id, filter);
  }

  // @get('/tag-groups/{id}/tags', {
  //   responses: {
  //     '200': {
  //       description: 'Tags in a tag group',
  //       content: {
  //         'application/json': {
  //           // schema: getModelSchemaRef(Tag, { includeRelations: true }),
  //
  //           schema: {
  //             type: 'array',
  //             items: getModelSchemaRef(Tag, {includeRelations: true}),
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async findTagsByGroupId(@param.path.string('id') id: string): Promise<Tag[]> {
  //   return this.tagRepository.find({where: {tagGroupId: id}});
  // }

  @patch('/tag-groups/{id}', {
    responses: {
      '204': {
        description: 'TagGroup PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagGroup, {partial: true}),
        },
      },
    })
    tagGroup: TagGroup,
  ): Promise<void> {
    await this.tagGroupRepository.updateById(id, tagGroup);
  }

  @put('/tag-groups/{id}', {
    responses: {
      '204': {
        description: 'TagGroup PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tagGroup: TagGroup,
  ): Promise<void> {
    await this.tagGroupRepository.replaceById(id, tagGroup);
  }

  @del('/tag-groups/{id}', {
    responses: {
      '204': {
        description: 'TagGroup DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tagGroupRepository.deleteById(id);
  }

  @del('/tag-groups/all', {
    responses: {
      '204': {
        description: 'Alert DELETE ALL success',
      },
    },
  })
  @authenticate('spia')
  async deleteAll(): Promise<void> {
    await this.tagGroupRepository.deleteAll();
  }

  @post('/tag-groups/commit', {
    responses: {
      '204': {
        description: 'Commmit Success',
      },
    },
  })
  @authenticate('spia')
  async commit(): Promise<void> {
    await this.tagGroupRepository.commit();
  }
}
