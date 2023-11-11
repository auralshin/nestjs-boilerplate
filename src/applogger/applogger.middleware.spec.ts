import { ApploggerMiddleware } from './applogger.middleware';
import { AppLoggerService } from './applogger.service';

describe('ApploggerMiddleware', () => {
  let appLoggerService: AppLoggerService;
  let apploggerMiddleware: ApploggerMiddleware;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    // Mock the AppLoggerService
    appLoggerService = { log: jest.fn(), error: jest.fn() } as any;
    apploggerMiddleware = new ApploggerMiddleware(appLoggerService);

    req = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      params: {},
      query: {},
      body: {},
      headers: {},
    };

    res = {
      statusCode: 200,
      statusMessage: '',
      on: jest.fn((event, callback) => callback()),
    };

    next = jest.fn();
  });

  it('should be defined', () => {
    expect(apploggerMiddleware).toBeDefined();
  });

  it('should call next', () => {
    apploggerMiddleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should log request with status code 200', () => {
    apploggerMiddleware.use(req, res, next);
    expect(appLoggerService.log).toHaveBeenCalled();
    expect(appLoggerService.error).not.toHaveBeenCalled();
  });

  it('should log error for status code 500', () => {
    res.statusCode = 500;
    apploggerMiddleware.use(req, res, next);
    expect(appLoggerService.error).toHaveBeenCalled();
    expect(appLoggerService.log).not.toHaveBeenCalled();
  });

  it('should log error for status code 400', () => {
    res.statusCode = 400;
    apploggerMiddleware.use(req, res, next);
    expect(appLoggerService.error).toHaveBeenCalled();
    expect(appLoggerService.log).not.toHaveBeenCalled();
  });
});
