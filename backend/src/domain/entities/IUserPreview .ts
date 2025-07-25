import { Types } from 'mongoose';
export interface IUserPreview {
  _id?: Types.ObjectId | string;
  username?: string;
  email: string;
  phone?: string;
  isBlocked: boolean;
}
