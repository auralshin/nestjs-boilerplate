import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';
import { OrgModule } from '../org/org.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsSecretModule } from '../aws-secret/aws-secret.module';
import { AwsSecretService } from '../aws-secret/aws-secret.service';
import { KeysName } from '../aws-secret/entity/keysName';
@Module({
  controllers: [AuthController],
  providers: [AuthService, AwsSecretService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule, AwsSecretModule],
      useFactory: async (
        configService: ConfigService,
        awsSecretService: AwsSecretService,
      ) => ({
        // secret: configService.get<string>('JWT_SECRET'),
        secret: await awsSecretService.getValue(KeysName.JWT_SECRET),
      }),
      inject: [ConfigService, AwsSecretService],
    }),
    forwardRef(() => OrgModule),
    ConfigModule,
    AwsSecretModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
