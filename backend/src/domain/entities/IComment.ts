import { Types } from 'mongoose';

export interface IReply {
  _id?: Types.ObjectId | string;
  user: Types.ObjectId | string;
  text: string;
  createdAt?: Date;
}


export interface IComment {
  _id?: Types.ObjectId | string;
  blogId: Types.ObjectId | string;
  user:Types.ObjectId | string;
  text: string;
  likes?: string[];         
  replies?: IReply[];
  createdAt?: Date;
}
