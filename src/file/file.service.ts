import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { Model } from 'mongoose';

@Injectable()
export class FileService {
  constructor(@InjectModel('File') private readonly fileModel: Model<File>) {}

  validateFile(file: any) {
    if (!file) {
      throw new HttpException(
        'File Size is required',
        HttpStatus.LENGTH_REQUIRED,
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new HttpException(
        'File Size Exceeded 10MB',
        HttpStatus.PAYLOAD_TOO_LARGE,
      );
    }
  }

  checkFileType(file: any) {
    const fileType = mime.lookup(file.originalname);

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg',
      'application/pdf',
    ];
    if (!allowedTypes.includes(fileType)) {
      throw new BadRequestException(
        `Invalid file type ${fileType}. Only jpeg, png, svg and pdf are allowed`,
      );
    }

    const allowedExtensions = ['jpeg', 'jpg', 'png', 'svg', 'pdf'];
    const fileExtension = file.originalname.split('.').pop();
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file extension ${fileExtension}. Only jpeg, jpg, png, svg and pdf are allowed`,
      );
    }
  }

  async validateFiles(files: Array<Express.Multer.File>) {
    for (const file in files) {
      const allowedMimeType = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/svg+xml',
        'application/pdf',
      ];
      const allowedFileType = ['png', 'jpg', 'jpeg', 'svg', 'pdf'];
      const mimeType = files[file].mimetype;
      const fileType = files[file].originalname.split('.').pop();
      await this.validateFile(files[file]);
      if (
        !allowedMimeType.includes(mimeType) ||
        !allowedFileType.includes(fileType)
      ) {
        throw new BadRequestException('Invalid File Type');
      }
    }
  }

  async validateSingleFile(file: Express.Multer.File) {
    const allowedMimeType = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/svg+xml',
      'application/pdf',
    ];
    const allowedFileType = ['png', 'jpg', 'jpeg', 'svg', 'pdf'];
    const mimeType = file.mimetype;
    const fileType = file.originalname.split('.').pop();
    await this.validateFile(file);
    if (
      !allowedMimeType.includes(mimeType) ||
      !allowedFileType.includes(fileType)
    ) {
      throw new BadRequestException('Invalid File Type');
    }
    }

  checkFileHeader(filePath: string) {
    const buffer = Buffer.alloc(4);
    try {
      const fd = fs.openSync(filePath, 'r');
      fs.readSync(fd, buffer, 0, 4, 0);
      fs.closeSync(fd);
    } catch (err) {
      return false;
    }

    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return true;
    } else {
      return false;
    }
  }
}
