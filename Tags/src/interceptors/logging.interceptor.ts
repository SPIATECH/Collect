//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  inject,
} from '@loopback/context';
import {RestBindings} from '@loopback/rest';
import {SpiaLoggerService} from '../services';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'Logging'}})
export class LoggingInterceptor implements Provider<Interceptor> {
  constructor(@inject('spia-logger') protected logger: SpiaLoggerService) {}

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
    const httpReq: Request = await invocationCtx.get<Request>(
      RestBindings.Http.REQUEST,
    );

    if (httpReq) {
      let message = httpReq.method + ' : ' + httpReq.url;
      if (Object.keys(httpReq.headers).length > 0) {
        message += '\t ' + JSON.stringify(httpReq.headers);
      }

      this.logger.log(message);
    }
    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
