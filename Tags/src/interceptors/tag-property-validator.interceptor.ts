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
import {repository} from '@loopback/repository';
import {TagTypeRepository, TagRepository} from '../repositories';
import {Tag} from '../models';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({tags: {key: TagPropertyValidatorInterceptor.BINDING_KEY}})
export class TagPropertyValidatorInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${TagPropertyValidatorInterceptor.name}`;

  constructor(
    @repository(TagTypeRepository)
    public tagTypeRepository: TagTypeRepository,
    @repository(TagRepository)
    public tagRepository: TagRepository,
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
    const tags: Tag[] = [];
    if (invocationCtx.methodName === 'create') {
      tags.push(invocationCtx.args[0]);
    } else if (invocationCtx.methodName === 'updateById') {
      tags.push(invocationCtx.args[1]);
    }
    for (const t of tags) {
      await this.validate(t);
    }
    const result = await next();

    // Add post-invocation logic here
    return result;
  }

  async validate(tag: Tag): Promise<Boolean> {
    let tagType;
    if (tag.tagTypeId === undefined || tag.tagTypeId === '') {
      const err = {
        statusCode: 400,
        message: 'Validation failed : Invalid Tag Type Id ',
      };
      throw err;
    }
    try {
      tagType = await this.tagTypeRepository.findById(tag.tagTypeId);
    } catch (ex) {
      console.log(ex);
      const err = {
        statusCode: 400,
        message: 'Validation failed  when fetching tag type: ' + ex,
      };
      throw err;
    }

    const allProperties = tagType.properties;

    if (allProperties === undefined) {
      return true;
    }

    for (const prop of allProperties) {
      // console.log(tag[prop.name]);
      if (prop.name === undefined) {
        const err = {
          statusCode: 400,
          message: 'Invalid property name / name of property not defined',
        };
        throw err;
      }
      if (tag[prop.name] === undefined && prop.required) {
        const err = {
          statusCode: 400,
          message: 'Validation failed with property : ' + prop.name,
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

          if (!propRegex.test(tag[prop.name])) {
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
