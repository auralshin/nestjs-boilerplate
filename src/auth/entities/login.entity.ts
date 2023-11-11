import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginEntity {
  @ApiProperty()
  @IsEmail()
  email: string;
}
