
import { ObjectId,Types } from 'mongoose';

export interface IUser {
  _id?:  Types.ObjectId|string;
  username?: string;
  email: string;
  phone?: number;
  password?: string;
  role?: 'user' | 'admin';
  isBlocked?: boolean;
  fullName?: string;
  dob?: Date;
  gender?: 'male' | 'female' ;
  profileImage?: string;
  bio?: string;
 links?: {
    platform: string;
    url: string;
  }[];
  followers?: string[];
following?: string[];

  interests?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  googleId?: string;
  isGoogleUser?: boolean;

}
