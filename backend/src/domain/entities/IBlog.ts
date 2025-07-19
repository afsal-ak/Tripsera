import { Types } from 'mongoose';

export interface IComment {
  _id?: Types.ObjectId | string;
  user: Types.ObjectId | string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlog {
  _id?: Types.ObjectId | string;
  title: string;
  slug: string;
  content: string;
  coverImage?: {
    url: string;
    public_id: string;
  };
  images?: { url: string; public_id: string }[];
  tags?: string[];
  author: Types.ObjectId | string;
  isPublished?: boolean;
  likes?: (Types.ObjectId | string)[];
  comments?: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}
