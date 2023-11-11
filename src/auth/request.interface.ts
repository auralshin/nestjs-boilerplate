/**
 * AuthRequest is an interface that extends the default Express Request interface.
 * It adds the `user` property to the request object, which represents the authenticated user.
 * The `user` property is of type UserDocument from the User schema.
 */

import { UserDocument } from '../user/types/user.type';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: UserDocument;
}
