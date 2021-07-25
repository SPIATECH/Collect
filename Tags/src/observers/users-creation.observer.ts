//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
  inject,
  CoreBindings,
  Application,
  Getter, // The interface
} from '@loopback/core';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {PasswordHasher} from '../services';
import {ApplicationBindings} from '../common/bindings';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class UsersCreationObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject('app.config') private config: CollectConfigurationConstants,
    @repository.getter(UserRepository) private userRepo: Getter<UserRepository>,
    @inject(ApplicationBindings.PASSWORD_HASHER)
    protected passwordHasher: PasswordHasher,
  ) {}

  async start(): Promise<void> {
    // Add your logic for start
    await (await this.userRepo()).deleteAll();

    const defaultEmail = this.config.defaultCreds.email;
    const defaultPassword = this.config.defaultCreds.password;

    if (defaultEmail && defaultPassword) {
      const hashedPassword = await this.passwordHasher.hashPassword(
        defaultPassword,
      );
      await (await this.userRepo()).create({
        email: defaultEmail,
        password: hashedPassword,
      });
    }
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
