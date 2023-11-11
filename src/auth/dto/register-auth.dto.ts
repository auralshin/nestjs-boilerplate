import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { OrgType } from '../types/auth.enum';
import { CountryClass } from '../types/auth.class';
import { Transform, Type } from 'class-transformer';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Email of the user',
    title: 'Email',
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
  language: string;
  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => CountryClass)
  residentialCountry: CountryClass;
  @ApiProperty()
  @IsString()
  phoneCode: string;
  @ApiProperty()
  @IsEnum(AccountType)
  @IsString()
  accountType: AccountType;
  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  mobileNumber: number;
  @ApiProperty()
  @IsString()
  orgName: string;
  @ApiProperty()
  @IsString()
  @IsEnum(OrgType)
  orgType: OrgType;
}
