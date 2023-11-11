import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { AccountType } from '../../global-types/global.enum';

export class CreateEntity {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  role: string;
  @ApiProperty()
  @IsString()
  language: string;
  @ApiProperty()
  @IsString()
  phoneCode: string;
  @ApiProperty()
  residentialCountry: string;
  @ApiProperty()
  @IsString()
  residentialCountryIso2: string;
  @ApiProperty()
  @IsString()
  residentialCountryIso3: string;
  @ApiProperty()
  @IsString()
  accountType: AccountType;
  @ApiProperty()
  @IsNumber()
  mobileNumber: number;
  @ApiProperty()
  @IsString()
  orgName: string;
  @ApiProperty()
  @IsString()
  orgID: Types.ObjectId;
}
