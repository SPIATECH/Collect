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
import {Config} from '../models';
import {ConfigRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class ConfigController {
  constructor(
    @repository(ConfigRepository)
    public configRepository: ConfigRepository,
  ) {}

  @post('/configs', {
    responses: {
      '200': {
        description: 'Config model instance',
        content: {'application/json': {schema: getModelSchemaRef(Config)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Config, {
            title: 'NewConfig',
          }),
        },
      },
    })
    config: Config,
  ): Promise<Config> {
    return this.configRepository.create(config);
  }

  @get('/configs/count', {
    responses: {
      '200': {
        description: 'Config model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Config))
    where?: Where<Config>,
  ): Promise<Count> {
    return this.configRepository.count(where);
  }

  @get('/configs', {
    responses: {
      '200': {
        description: 'Array of Config model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Config, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Config))
    filter?: Filter<Config>,
  ): Promise<Config[]> {
    return this.configRepository.find(filter);
  }

  @patch('/configs', {
    responses: {
      '200': {
        description: 'Config PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Config, {partial: true}),
        },
      },
    })
    config: Config,
    @param.query.object('where', getWhereSchemaFor(Config))
    where?: Where<Config>,
  ): Promise<Count> {
    return this.configRepository.updateAll(config, where);
  }

  @get('/configs/{id}', {
    responses: {
      '200': {
        description: 'Config model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Config, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Config))
    filter?: Filter<Config>,
  ): Promise<Config> {
    return this.configRepository.findById(id, filter);
  }

  @patch('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Config, {partial: true}),
        },
      },
    })
    config: Config,
  ): Promise<void> {
    await this.configRepository.updateById(id, config);
  }

  @put('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() config: Config,
  ): Promise<void> {
    await this.configRepository.replaceById(id, config);
  }

  @del('/configs/{id}', {
    responses: {
      '204': {
        description: 'Config DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.configRepository.deleteById(id);
  }
}
