import { Types } from "mongoose";

export type IMessageType =
  | "text"
  | "image"
  | "file"
  | "blog"
  | "package"
  | "audio"
  | "call"; // ✅ Added

// export interface ICallInfo {
//   callType: "audio" | "video";
//   status: "initiated" | "answered" | "missed" | "ended";
//   startedAt?: Date;
//   endedAt?: Date;
//   duration?: number;
//   callerId: Types.ObjectId | string;
//   receiverId: Types.ObjectId | string;
// }

export interface ICallInfo {
  callType: "audio" | "video";
  status: "initiated" | "answered" | "missed" | "ended"|"rejected"|"cancelled";
  startedAt?: Date;
  endedAt?: Date;
  duration:number;
  callerId: string;
  receiverId: string;
}
export interface IMessage {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  content: string;
  type?: IMessageType;
  mediaUrl?: string;
  isRead?: boolean;
  readBy?: (Types.ObjectId | string)[];
     callInfo?: Partial<ICallInfo>;  
  createdAt?: Date;
  updatedAt?: Date;
}
