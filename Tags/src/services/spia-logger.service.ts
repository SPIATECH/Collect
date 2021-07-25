//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

import {bind, /* inject, */ BindingScope, inject} from '@loopback/core';

import winston, {format} from 'winston';
import {ConfigurationService} from './configuration.service';
import moment from 'moment-timezone';

@bind({scope: BindingScope.SINGLETON})
export class SpiaLoggerService {
  protected logger: winston.Logger;

  constructor(
    @inject('service.configuration') configService: ConfigurationService,
  ) {
    const spiaFormat = format.printf(
      info =>
        `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`,
    );

    const appendTimestamp = format((info, opts) => {
      if (opts.tz) info.timestamp = moment().tz(opts.tz).format();
      return info;
    });
    this.logger = winston.createLogger({
      level: configService.getConfiguration().loglevel,
      format: winston.format.combine(
        format.label({label: 'main'}),
        appendTimestamp({tz: configService.getConfiguration().defaultTimeZone}),
        spiaFormat,
      ),
      // defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({
          level: configService.getConfiguration().loglevel,
          filename: configService.getLogFileName(),
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.printf(info => {
              return `[${info.timestamp}] ${info.level} | ${info.message}`;
            }),
          ),
          // json: false,
          maxsize: configService.getConfiguration().LOG_FILE_MAXSIZE,
          maxFiles: configService.getConfiguration().LOG_FILE_MAXNO,
          // colorize: false
        }),
      ],
      exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({filename: configService.getLogFileName()}),
      ],
      exitOnError: false,
    });
  }

  log(message: string) {
    if (!this.logger) console.log(message);
    this.logger.info(message);
  }

  error(message: string) {
    if (!this.logger) console.error(message);
    this.logger.error(message);
  }

  warn(message: string) {
    if (!this.logger) console.warn(message);
    this.logger.warn(message);
  }

  alert(message: string) {
    if (!this.logger) console.trace(message);
    this.logger.alert(message);
  }

  debug(message: string) {
    if (!this.logger) console.debug(message);

    this.logger.debug(message);
  }
  /*
   * Add service methods here
   */
}
