// import { Types } from "mongoose";

// export interface IChatRoom {
//   _id?: Types.ObjectId|string;
//   name?: string; 
//   participants: Types.ObjectId[]|string[]; // Array of user/admin IDs
//   createdBy: Types.ObjectId|string;      // Who created the room
//   isGroup: boolean;               // For future group chat support
//   lastMessage?: string;   // Reference to the last message
//   unreadCounts?: {
//     [userId: string]: number;     // Unread count per user
//   };
//    createdAt?: Date;
//   updatedAt?: Date;
// }
import { Types } from "mongoose";

export interface IChatRoom {
  _id?: Types.ObjectId | string;
  name?: string;
  participants: (Types.ObjectId | string)[];
  createdBy: Types.ObjectId | string;
  isGroup: boolean;
  lastMessage?: Types.ObjectId | string;
  lastMessageContent?: string;  //  Added
  unreadCounts?: {
    [userId: string]: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
