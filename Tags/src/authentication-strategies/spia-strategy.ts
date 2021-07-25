//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {inject} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {ApplicationBindings} from '../common/bindings';
import {CollectConfigurationConstants} from '../CollectConfigurationConstants';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';

export class SpiaAuthenticationStrategy implements AuthenticationStrategy {
  name = 'spia';

  constructor(
    @inject(ApplicationBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
    @inject('app.config')
    private config: CollectConfigurationConstants,
    @repository(UserRepository) protected userRepo: UserRepository,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    if (this.config.enableAuthentication) {
      const token: string = this.extractCredentials(request);
      const userProfile = await this.tokenService.verifyToken(token);
      try {
        const user = await this.userRepo.findById(userProfile[securityId]);
        if (!user) {
          /// Contact ldap / keycloak
          throw new HttpErrors.Unauthorized(`Invalid User`);
        }
      } catch (ex) {
        throw new HttpErrors.Unauthorized(`Invalid User`);
      }
      return userProfile;
    } else {
      return {name: 'anonymous', email: 'anon@spiatech.com', [securityId]: ''};
    }
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example: Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    // split the string into 2 parts: 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];

    return token;
  }
}
