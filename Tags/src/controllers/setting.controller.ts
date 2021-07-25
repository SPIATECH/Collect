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
import {Setting} from '../models';
import {SettingRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
@authenticate('spia')
export class SettingController {
  constructor(
    @repository(SettingRepository)
    public settingRepository: SettingRepository,
  ) {}

  @post('/settings', {
    responses: {
      '200': {
        description: 'Setting model instance',
        content: {'application/json': {schema: getModelSchemaRef(Setting)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Setting, {
            title: 'NewSetting',
          }),
        },
      },
    })
    setting: Setting,
  ): Promise<Setting> {
    return this.settingRepository.create(setting);
  }

  @get('/settings/count', {
    responses: {
      '200': {
        description: 'Setting model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Setting))
    where?: Where<Setting>,
  ): Promise<Count> {
    return this.settingRepository.count(where);
  }

  @get('/settings', {
    responses: {
      '200': {
        description: 'Array of Setting model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Setting, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Setting))
    filter?: Filter<Setting>,
  ): Promise<Setting[]> {
    return this.settingRepository.find(filter);
  }

  @patch('/settings', {
    responses: {
      '200': {
        description: 'Setting PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Setting, {partial: true}),
        },
      },
    })
    setting: Setting,
    @param.query.object('where', getWhereSchemaFor(Setting))
    where?: Where<Setting>,
  ): Promise<Count> {
    return this.settingRepository.updateAll(setting, where);
  }

  @get('/settings/{id}', {
    responses: {
      '200': {
        description: 'Setting model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Setting, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Setting))
    filter?: Filter<Setting>,
  ): Promise<Setting> {
    return this.settingRepository.findById(id, filter);
  }

  @patch('/settings/{id}', {
    responses: {
      '204': {
        description: 'Setting PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Setting, {partial: true}),
        },
      },
    })
    setting: Setting,
  ): Promise<void> {
    await this.settingRepository.updateById(id, setting);
  }

  @put('/settings/{id}', {
    responses: {
      '204': {
        description: 'Setting PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() setting: Setting,
  ): Promise<void> {
    await this.settingRepository.replaceById(id, setting);
  }

  @del('/settings/{id}', {
    responses: {
      '204': {
        description: 'Setting DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.settingRepository.deleteById(id);
  }
}
