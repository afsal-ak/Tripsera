
import { ObjectId,Types } from 'mongoose';

export interface IUser {
  _id?:  Types.ObjectId|string;
  username?: string;
  email: string;
  phone?: number;
  password?: string;
  role?: 'user' | 'admin';
 // followers?: string[];     
 // following?: string[];
 // bio?: string;
  profilePic?: string;
 // interests?: string[];
  isBlocked?: boolean;
  dob?: Date;
  firstName?: string;
  secondName?: string;
  location?: string;
  googleId?: string;
  isGoogleUser?: boolean;

}
