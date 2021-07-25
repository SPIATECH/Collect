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
import {Alert} from '../models';
import {AlertRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('spia')
export class AlertController {
  constructor(
    @repository(AlertRepository)
    public alertRepository: AlertRepository,
  ) {}

  @post('/alerts', {
    responses: {
      '200': {
        description: 'Alert model instance',
        content: {'application/json': {schema: getModelSchemaRef(Alert)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alert, {
            title: 'NewAlert',
          }),
        },
      },
    })
    alert: Alert,
  ): Promise<Alert> {
    return this.alertRepository.create(alert);
  }

  @post('/alerts/commit', {
    responses: {
      '204': {
        description: 'Commmit Success',
      },
    },
  })
  async commit(): Promise<void> {
    await this.alertRepository.commit();
  }

  @get('/alerts/count', {
    responses: {
      '200': {
        description: 'Alert model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Alert)) where?: Where<Alert>,
  ): Promise<Count> {
    return this.alertRepository.count(where);
  }

  @get('/alerts', {
    responses: {
      '200': {
        description: 'Array of Alert model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Alert, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Alert))
    filter?: Filter<Alert>,
  ): Promise<Alert[]> {
    return this.alertRepository.find(filter);
  }

  @patch('/alerts', {
    responses: {
      '200': {
        description: 'Alert PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alert, {partial: true}),
        },
      },
    })
    alert: Alert,
    @param.query.object('where', getWhereSchemaFor(Alert)) where?: Where<Alert>,
  ): Promise<Count> {
    return this.alertRepository.updateAll(alert, where);
  }

  @get('/alerts/{id}', {
    responses: {
      '200': {
        description: 'Alert model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Alert, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Alert))
    filter?: Filter<Alert>,
  ): Promise<Alert> {
    return this.alertRepository.findById(id, filter);
  }

  @patch('/alerts/{id}', {
    responses: {
      '204': {
        description: 'Alert PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Alert, {partial: true}),
        },
      },
    })
    alert: Alert,
  ): Promise<void> {
    await this.alertRepository.updateById(id, alert);
  }

  @put('/alerts/{id}', {
    responses: {
      '204': {
        description: 'Alert PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() alert: Alert,
  ): Promise<void> {
    await this.alertRepository.replaceById(id, alert);
  }

  @del('/alerts/{id}', {
    responses: {
      '204': {
        description: 'Alert DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.alertRepository.deleteById(id);
  }

  @del('/alerts/all', {
    responses: {
      '204': {
        description: 'Alert DELETE ALL success',
      },
    },
  })
  @authenticate('spia')
  async deleteAll(): Promise<void> {
    await this.alertRepository.deleteAll();
  }
}
