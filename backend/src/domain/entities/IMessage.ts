
import { Types } from "mongoose";

export type IMessageType = "text" | "image" | "file" | "blog" | "package "|"audio";

export interface IMessage {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  content: string;
  type?:IMessageType
//  attachments?: string[];
  mediaUrl?: string;
  isRead?: boolean;
  readBy?: (Types.ObjectId | string)[];
  createdAt?: Date;
  updatedAt?: Date;
}
