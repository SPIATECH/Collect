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
import {TagType} from '../models';
import {TagTypeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class TagTypeController {
  constructor(
    @repository(TagTypeRepository)
    public tagTypeRepository: TagTypeRepository,
  ) {}

  @post('/tag-types', {
    responses: {
      '200': {
        description: 'TagType model instance',
        content: {'application/json': {schema: getModelSchemaRef(TagType)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagType, {
            title: 'NewTagType',
          }),
        },
      },
    })
    tagType: TagType,
  ): Promise<TagType> {
    return this.tagTypeRepository.create(tagType);
  }

  @get('/tag-types/count', {
    responses: {
      '200': {
        description: 'TagType model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TagType))
    where?: Where<TagType>,
  ): Promise<Count> {
    return this.tagTypeRepository.count(where);
  }

  @get('/tag-types', {
    responses: {
      '200': {
        description: 'Array of TagType model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TagType, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TagType))
    filter?: Filter<TagType>,
  ): Promise<TagType[]> {
    return this.tagTypeRepository.find(filter);
  }

  @patch('/tag-types', {
    responses: {
      '200': {
        description: 'TagType PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagType, {partial: true}),
        },
      },
    })
    tagType: TagType,
    @param.query.object('where', getWhereSchemaFor(TagType))
    where?: Where<TagType>,
  ): Promise<Count> {
    return this.tagTypeRepository.updateAll(tagType, where);
  }

  @get('/tag-types/{id}', {
    responses: {
      '200': {
        description: 'TagType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TagType, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TagType))
    filter?: Filter<TagType>,
  ): Promise<TagType> {
    return this.tagTypeRepository.findById(id, filter);
  }

  @patch('/tag-types/{id}', {
    responses: {
      '204': {
        description: 'TagType PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TagType, {partial: true}),
        },
      },
    })
    tagType: TagType,
  ): Promise<void> {
    await this.tagTypeRepository.updateById(id, tagType);
  }

  @put('/tag-types/{id}', {
    responses: {
      '204': {
        description: 'TagType PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tagType: TagType,
  ): Promise<void> {
    await this.tagTypeRepository.replaceById(id, tagType);
  }

  @del('/tag-types/{id}', {
    responses: {
      '204': {
        description: 'TagType DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tagTypeRepository.deleteById(id);
  }

  @del('/tag-types/all', {
    responses: {
      '204': {
        description: 'Alert DELETE ALL success',
      },
    },
  })
  async deleteAll(): Promise<void> {
    await this.tagTypeRepository.deleteAll();
  }
}
