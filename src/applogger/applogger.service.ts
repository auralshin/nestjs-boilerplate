import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import moment from 'moment';
// import { S3Service } from '../s3/s3.service';

/**
 * AppLoggerService is a custom logger service that extends ConsoleLogger from @nestjs/common
 * and uses winston as the underlying logging library. It provides methods for logging messages
 * with different log levels (log, error, warn, verbose, debug).
 *
 * The logger is initialized with a winston logger instance and a default log level of 'info'.
 * It also formats log messages with timestamps and context information.
 *
 * The service supports dependency injection of the S3Service class.
 * When logging a message, it includes the context and a timestamp using the moment library.
 * If you are using S3 remember to add the S3Service to the providers array in the module where
 * you are using the AppLoggerService. See the example below.
 */

@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  private logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
          }),
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
          }),
        ),
      }),
    ],
  });

  /**
   * Creates an instance of AppLoggerService.
   * @param s3Service - An instance of the S3Service used for dependency injection.
   */
  //   constructor(@Inject(S3Service) private s3Service: S3Service) {
  //     super();
  //   }

  constructor() {
    super();
  }
  /**
   * Logs a message with the 'info' log level.
   * @param message - The log message to be logged.
   */
  log(message: string) {
    this.logger.info(message, {
      context: this.context,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  /**
   * Logs a message with the 'error' log level.
   * @param message - The log message to be logged.
   */
  error(message: string) {
    this.logger.error(message, {
      context: this.context,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  /**
   * Logs a message with the 'warn' log level.
   * @param message - The log message to be logged.
   */
  warn(message: string) {
    this.logger.warn(message, {
      context: this.context,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  /**
   * Logs a message with the 'verbose' log level.
   * @param message - The log message to be logged.
   */
  verbose(message: string) {
    this.logger.verbose(message, {
      context: this.context,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  /**
   * Logs a message with the 'debug' log level.
   * @param message - The log message to be logged.
   */
  debug(message: string) {
    this.logger.debug(message, {
      context: this.context,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
}
