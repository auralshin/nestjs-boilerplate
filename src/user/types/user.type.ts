import { HydratedDocument } from 'mongoose';
import { User } from '../user.schema';
export type UserDocument = HydratedDocument<User>;
