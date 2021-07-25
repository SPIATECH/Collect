//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {registerAuthenticationStrategy} from '@loopback/authentication';
import {HealthComponent} from '@loopback/extension-health';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AlertSequence} from './sequence';
import {
  MqttServiceService,
  SpiaLoggerService,
  SpiaUserService,
  MqttRestProxyService,
} from './services';
import {ConfigurationService} from './services/configuration.service';
import {
  MqttLifeCycleObserverObserver,
  UsersCreationObserver,
} from './observers';
import fs from 'fs';
import {AuthenticationComponent} from '@loopback/authentication';
import {SpiaAuthenticationStrategy} from './authentication-strategies';
import {SECURITY_SPEC, SECURITY_SCHEME_SPEC} from './common/security.spec';
import {ApplicationBindings} from './common/bindings';
import {SpiaToken, BcryptHasher} from './services';
import {AlertRepository, DeviceTypeRepository} from './repositories';
const pkg = require('../package.json');

export class CollectApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    const configurationService: ConfigurationService = new ConfigurationService();

    const config = configurationService.readConfiguration();

    options.rest = {...options.rest, ...config};

    super(options);

    let openApiComponents = {};
    let securitySpec = [{}];
    let description = pkg.description;
    if (config.enableAuthentication) {
      openApiComponents = {securitySchemes: SECURITY_SCHEME_SPEC};
      securitySpec = SECURITY_SPEC;
      description += ' Authentication Enabled';
    }
    this.api({
      openapi: '3.0.0',
      info: {
        title: description,
        version: pkg.version,
      },
      paths: {},
      components: openApiComponents,
      servers: [{url: '/'}],
      security: securitySpec,
    });

    this.bind('app').to(this);

    this.bind('app.config').to(config).inScope(BindingScope.SINGLETON);

    this.setupBindings(configurationService);

    this.setupRepositories();

    this.component(AuthenticationComponent);

    // Set up the custom sequence
    this.sequence(AlertSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });

    this.component(HealthComponent);

    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBindings(configurationService: ConfigurationService) {
    this.bind(ApplicationBindings.TOKEN_SERVICE).toClass(SpiaToken);

    this.bind(ApplicationBindings.SERVICE_USER).toClass(SpiaUserService);

    this.bind(ApplicationBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    registerAuthenticationStrategy(this, SpiaAuthenticationStrategy);

    this.setupDatabase(configurationService.getDatabaseFileName());

    this.bind('service.configuration')
      .toClass(ConfigurationService)
      .inScope(BindingScope.SINGLETON);

    this.bind('service.mqtt-service')
      .toClass(MqttServiceService)
      .inScope(BindingScope.SINGLETON);

    this.bind('service.mqtt-rest-service')
      .toClass(MqttRestProxyService)
      .inScope(BindingScope.SINGLETON);

    // this.bind('service.allgroups-message-parser')
    //   .toClass(AllGroupsMessageParserService)
    //   .inScope(BindingScope.TRANSIENT);

    this.lifeCycleObserver(MqttLifeCycleObserverObserver);

    this.lifeCycleObserver(UsersCreationObserver);

    this.bind('spia-logger')
      .toClass(SpiaLoggerService)
      .inScope(BindingScope.SINGLETON);
  }

  setupRepositories() {
    this.repository(AlertRepository);
    this.repository(DeviceTypeRepository);
  }

  setupDatabase(databaseFileName: string) {
    const newDatabaseConfig = {
      name: 'LocalDb',
      connector: 'memory',
      localStorage: 'spia-db',
      file: databaseFileName,
    };

    const fileName = databaseFileName;

    const dbFolderLocation = fileName.substring(
      0,
      fileName.lastIndexOf('/') + 1,
    );
    if (dbFolderLocation !== '' && !fs.existsSync(dbFolderLocation)) {
      fs.mkdirSync(dbFolderLocation, {recursive: true});
    }

    this.bind('datasources.config.LocalDb').to(newDatabaseConfig);
  }
}
