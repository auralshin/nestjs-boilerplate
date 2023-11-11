import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator';

import { OrgType } from '../types/auth.enum';
import { CountryClass } from '../types/auth.class';
import { AccountType } from '../../global-types/global.enum';
import { Type } from 'class-transformer';

export class RegisterEntity {
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
  @ValidateNested({ each: true })
  @Type(() => CountryClass)
  residentialCountry: CountryClass;
  @ApiProperty()
  @IsString()
  phoneCode: string;
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
  orgType: OrgType;
}
