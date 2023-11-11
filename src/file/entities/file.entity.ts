import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FileEntity {
  @ApiProperty()
  @IsString()
  _id: string;
  @ApiProperty()
  @IsString()
  fileName: string;
  @ApiProperty()
  @IsString()
  fileType: string;
  @ApiProperty()
  @IsString()
  fileUploadUrl: string;
  @ApiProperty()
  @IsString()
  fileWallexId: string;
  @ApiProperty()
  @IsNumber()
  fileLength: number;
  @ApiProperty()
  @IsString()
  fileS3Id: string;
  @ApiProperty()
  @IsString()
  fileS3Url: string;
  @ApiProperty()
  @IsString()
  fileDocumentType: string;
}
