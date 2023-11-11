import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypePipe implements PipeTransform {
  constructor(private readonly fileType: RegExp) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!this.fileType.test(file.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
    }
    return file;
  }
}
