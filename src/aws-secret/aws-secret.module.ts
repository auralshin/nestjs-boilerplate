import { Module } from '@nestjs/common';
import { AwsSecretService } from './aws-secret.service';

@Module({
  providers: [AwsSecretService],
  exports: [AwsSecretService],
})
export class AwsSecretModule {}
