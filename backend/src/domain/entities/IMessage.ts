// import { Types } from "mongoose";

// export interface IMessage {
//   _id?: Types.ObjectId;
//   roomId: Types.ObjectId;         // Chat room ID
//   senderId: Types.ObjectId;       // User/Admin who sends the message
//   content: string;              // Message text
//   type?: "text" | "image" | "file"|"blog"|"package";  
//   attachments?: string[];       // URLs for uploaded images/files
//   isRead?: boolean;             // Whether recipient read it
//   readBy?: Types.ObjectId[];    // For group chats
//   createdAt?: Date;
//   updatedAt?: Date;
// }
import { Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  content: string;
  type?: "text" | "image" | "file" | "blog" | "package"; // ✅ Match schema
  attachments?: string[];
  isRead?: boolean;
  readBy?: (Types.ObjectId | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}
