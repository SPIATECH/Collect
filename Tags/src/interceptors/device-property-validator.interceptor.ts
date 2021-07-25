//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  /* inject, */
  bind,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/context';
import {Device} from '../models';
import {DeviceTypeRepository, DeviceRepository} from '../repositories';
import {repository} from '@loopback/repository';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({tags: {key: DevicePropertyValidatorInterceptor.BINDING_KEY}})
export class DevicePropertyValidatorInterceptor
  implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${DevicePropertyValidatorInterceptor.name}`;

  constructor(
    @repository(DeviceTypeRepository)
    public deviceTypeRepository: DeviceTypeRepository,
    @repository(DeviceRepository)
    public deviceRepository: DeviceRepository,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // Add pre-invocation logic here
    const devices: Device[] = [];
    if (invocationCtx.methodName === 'create') {
      devices.push(invocationCtx.args[0]);
    } else if (invocationCtx.methodName === 'updateById') {
      devices.push(invocationCtx.args[1]);
    }

    for (const d of devices) {
      await this.validate(d);
    }

    const result = await next();

    // Add post-invocation logic here
    return result;
  }

  async validate(dev: Device): Promise<Boolean> {
    if (dev.deviceTypeId === undefined || dev.deviceTypeId === '') {
      const err = {
        statusCode: 400,
        message: 'Invalid device type id',
      };
      throw err;
    }
    const deviceType = await this.deviceTypeRepository.findById(
      dev.deviceTypeId,
    );
    if (deviceType.properties === undefined) {
      return true;
    }
    for (const prop of deviceType.properties) {
      if (dev[prop.name] === undefined && prop.required) {
        const err = {
          statusCode: 400,
          message: 'Validation failed :( Missing property )' + prop.name,
        };
        throw err;
      }
      if (prop.validations !== undefined) {
        for (const validation of prop.validations) {
          if (
            validation.validRegex === undefined ||
            validation.validRegex === ''
          ) {
            continue;
          }
          const propRegex = new RegExp(validation.validRegex);

          if (!propRegex.test(dev[prop.name])) {
            const err = {
              statusCode: 400,
              message: 'Validation failed REGEX: ' + prop.name,
            };
            throw err;
          }
        }
      }
    }

    return true;
  }
}
