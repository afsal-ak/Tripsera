import { Types } from 'mongoose';
import { IUser } from './IUser';

export interface IBlog {
  _id?: Types.ObjectId | string;
  title: string;
  slug?: string;
  content: string;
  coverImage?: {
    url: string;
    public_id: string;
  };
  images?: { url: string; public_id: string }[];
  tags?: string[];
  author: Types.ObjectId | string;
 
  likes?: (Types.ObjectId | string|IUser)[];
  status: 'draft' | 'published' | 'archived';
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
