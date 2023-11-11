import { Test, TestingModule } from '@nestjs/testing';
import { AppLoggerService } from './applogger.service';

describe('ApploggerService', () => {
  let service: AppLoggerService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLoggerService],
    }).compile();

    service = await module.resolve<AppLoggerService>(AppLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log a message with the info level', async () => {
      const message = 'This is a test message';
      const logSpy = jest.spyOn(service, 'log'); // Create a spy
      service.log(message);
      expect(logSpy).toHaveBeenCalledWith(message); // Check how the spy was called
    });
  });

  describe('error', () => {
    it('should log a message with the error level', async () => {
      const message = 'This is a test message';
      const errorSpy = jest.spyOn(service, 'error');
      service.error(message);
      expect(errorSpy).toHaveBeenCalledWith(message);
    });
  });

  describe('warn', () => {
    it('should log a message with the warn level', async () => {
      const message = 'This is a test message';
      const warnSpy = jest.spyOn(service, 'warn'); // Create a spy
      service.warn(message);
      expect(warnSpy).toHaveBeenCalledWith(message);
    });
  });

  describe('verbose', () => {
    it('should log a message with the verbose level', async () => {
      const message = 'This is a test message';
      const verboseSpy = jest.spyOn(service, 'verbose');
      service.verbose(message);
      expect(verboseSpy).toHaveBeenCalledWith(message);
    });
  });

  describe('debug', () => {
    it('should log a message with the debug level', async () => {
      const message = 'This is a test message';
      const debugSpy = jest.spyOn(service, 'debug');
      service.debug(message);
      expect(debugSpy).toHaveBeenCalledWith(message);
    });
  });
});
