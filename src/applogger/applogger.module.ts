import { Module } from '@nestjs/common';
import { AppLoggerService } from './applogger.service';

@Module({
  imports: [],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class AppLoggerModule {}
