//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {genSalt, hash} from 'bcryptjs';
import {compare} from 'bcryptjs';
import {inject} from '@loopback/core';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
export type HashPassword = (
  password: string,
  rounds: number,
) => Promise<string>;
// bind function to `services.bcryptjs.HashPassword`
export async function hashPassword(
  password: string,
  rounds: number,
): Promise<string> {
  const salt = await genSalt(rounds);
  return hash(password, salt);
}

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  constructor(
    @inject('app.config') private config: CollectConfigurationConstants,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.config.passwordRounds);
    return hash(password, salt);
  }

  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordIsMatched = await compare(providedPass, storedPass);
    return passwordIsMatched;
  }
}
