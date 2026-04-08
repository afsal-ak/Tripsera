import { Types } from "mongoose";

export interface IChatRoomPopulated {
  _id: Types.ObjectId | string;

  participants: {
    _id: Types.ObjectId;
    username?: string; // user
    name?: string;     // company
    profileImage?: { url?: string };
    logo?: { url?: string }; // 🔥 ADD THIS
  }[];

  isGroup: boolean;

  lastMessageContent: string;

  unreadCounts?: Record<string, number>;

  createdBy: string | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
// import { Types } from 'mongoose';
// import { IUser } from '@domain/entities/IUser';

// export interface IChatRoomPopulated {
//   _id: Types.ObjectId | string;
//   participants: Pick<any, '_id' | 'username' | 'profileImage'|'name'>[];
//   isGroup: boolean;
//   groupName?: string;
//   lastMessage?: {
//     content: string;
//     sender: string | Types.ObjectId;
//     createdAt: Date;
//   };
//   lastMessageContent: string;
//   unreadCounts?: Record<string, number>; // userId → count
//   createdBy: string | Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }
