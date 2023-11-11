import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { randomBytes } from 'crypto';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(randomBytes(12).toString('hex')),
  })
  _id: mongoose.Types.ObjectId;
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;
  @Prop({ required: false })
  title: string;
  @Prop({ required: false })
  firstName: string;
  @Prop({ required: false })
  lastName: string;
  @Prop({
    required: false,
    enum: ['admin', 'user'],
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
