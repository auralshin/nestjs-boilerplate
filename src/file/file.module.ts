import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { FileSchema } from './file.schema';
import { FileService } from './file.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  controllers: [],
  providers: [FileService],
  exports: [FileService, MongooseModule],
})
export class FileModule {}
