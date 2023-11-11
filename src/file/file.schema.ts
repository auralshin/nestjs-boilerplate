import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { FileType } from './types/file.enum';

@Schema({ timestamps: true })
export class File {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(randomBytes(12).toString('hex')),
  })
  _id: Types.ObjectId;
  @Prop({})
  fileName: string;
  @Prop({})
  fileType: FileType;
  @Prop({})
  fileUploadUrl: string;
  @Prop({})
  fileWallexId: string;
  @Prop({})
  fileLength: number;
  @Prop({})
  fileS3Id: string;
  @Prop({})
  fileS3Url: string;
  @Prop({})
  fileDocumentType: string;
  @Prop({ default: Date.now() })
  _createdAt: Date;
  @Prop({ default: Date.now() })
  _updatedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
