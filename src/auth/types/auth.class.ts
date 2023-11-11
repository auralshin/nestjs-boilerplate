import { IsString } from 'class-validator';

export class CountryClass {
  @IsString()
  country: string;
  @IsString()
  countryCode: string;
  @IsString()
  isoCode2: string;
  @IsString()
  isoCode3: string;
}
