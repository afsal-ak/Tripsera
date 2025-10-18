import { Types } from 'mongoose';

export interface IChatRoom {
  _id?: Types.ObjectId | string;
  name?: string;
  participants: (Types.ObjectId | string)[];
  createdBy: Types.ObjectId | string;
  isGroup: boolean;
  lastMessage?: Types.ObjectId | string;
  lastMessageContent?: string; //  Added
  unreadCounts?: {
    [userId: string]: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
