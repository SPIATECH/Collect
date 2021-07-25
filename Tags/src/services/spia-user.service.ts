//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {UserService} from '@loopback/authentication';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {UserProfile, securityId, Credential} from '@loopback/security';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {ApplicationBindings} from '../common/bindings';
import {PasswordHasher} from './hash-password.service';

export class SpiaUserCredential implements Credential {
  email: string;
  password: string;
}
export class SpiaUserService implements UserService<User, SpiaUserCredential> {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(ApplicationBindings.PASSWORD_HASHER)
    protected passwordHasher: PasswordHasher,
  ) {}

  async verifyCredentials(credentials: SpiaUserCredential): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `User with email ${credentials.email} not found.`,
      );
    }
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: '<' + user.email + '>' + user.name,
      [securityId]: user.id,
    };
  }
}
