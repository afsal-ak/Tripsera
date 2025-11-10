import { Types } from 'mongoose';
import { IUser } from './IUser';

export interface IBlogSection {
  _id?:string,
  heading: string;
  content: string;
  image?: {
    url: string;
    public_id?: string;
  };
}

export interface IBlogComment {
  _id?: Types.ObjectId | string;
  user: Types.ObjectId | IUser;
  text: string;
  createdAt?: Date;
}

export interface IBlog {
  _id?: Types.ObjectId | string;
  title: string;
  slug?: string;
  overview?: string; // short intro / summary
  content: string; // can hold the main article text

  coverImage?: {
    url: string;
    public_id?: string;
  };

  sections?: IBlogSection[]; // multi-section layout (heading + image + text)
  images?: { url: string; public_id?: string }[];

  tags?: string[];
  author: Types.ObjectId | string;

  likes?: (Types.ObjectId | IUser)[];
  comments?: IBlogComment[];

  status: 'draft' | 'published' | 'archived';
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
