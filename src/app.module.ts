import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppLoggerService } from './applogger/applogger.service';
import { AppLoggerModule } from './applogger/applogger.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { UserModule } from './user/user.module';
import config from '../config';

@Module({
  imports: [
    AppLoggerModule,
    S3Module,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      cache: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppLoggerService, S3Service],
})
export class AppModule {}
