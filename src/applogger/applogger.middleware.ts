import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AppLoggerService } from './applogger.service';

/**
 * ApploggerMiddleware is a Nest.js middleware that logs incoming requests and their corresponding responses.
 * It measures the elapsed time for each request and logs relevant information such as method,
 * * URL, IP address, parameters, query, body, headers, status code, and elapsed time.
 * The middleware uses an instance of the AppLoggerService to handle the logging.
 */
@Injectable()
export class ApploggerMiddleware implements NestMiddleware {
  /**
   * Creates an instance of ApploggerMiddleware.
   * @param appLoggerService - An instance of the AppLoggerService used for logging.
   */
  constructor(
    @Inject(AppLoggerService)
    private readonly appLoggerService: AppLoggerService,
  ) {}
  /**
   * Middleware method that logs request information and handles response logging.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - A function to proceed to the next middleware or route handler.
   */
  use(req: any, res: any, next: () => void) {
    const startTime = Date.now();

    res.on('finish', () => {
      const elapsedTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      const errorMessage = res.statusMessage || '';

      const requestLogString = `[${new Date().toISOString()}] Method: ${
        req.method
      } | URL: ${req.originalUrl} | IP: ${req.ip} | Params: ${JSON.stringify(
        req.params,
      )} | Query: ${JSON.stringify(req.query)} | Body: ${JSON.stringify(
        req.body,
      )} | Headers: ${JSON.stringify(
        req.headers,
      )} | Status Code: ${statusCode}${
        errorMessage ? ' | Error: ' + errorMessage : ''
      } | Elapsed Time: ${elapsedTime}ms`;

      if (statusCode >= 500) {
        this.appLoggerService.error(requestLogString);
      } else if (statusCode >= 400) {
        this.appLoggerService.error(requestLogString);
      } else {
        this.appLoggerService.log(requestLogString);
      }
    });

    res.on('close', () => {
      // Set the error message from the response object when the connection is closed
      if (res.locals && res.locals.errorMessage) {
        res.locals.errorMessage = res.locals.errorMessage;
      }
    });

    next();
  }
}
