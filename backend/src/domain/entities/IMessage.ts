import { Types } from "mongoose";
import { EnumMessageType,EnumCallStatus,EnumCallType, } from "@constants/enum/messageEnum";

export interface ICallInfo {
  callType: EnumCallType;
  status: EnumCallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration: number;
  callerId: string;
  receiverId: string;
}

export interface IMessage {
  _id?: Types.ObjectId;
  roomId: Types.ObjectId | string;
  senderId: Types.ObjectId | string;
  content: string;
  type?: EnumMessageType;
  mediaUrl?: string;
  isRead?: boolean;
  readBy?: (Types.ObjectId | string)[];
  callInfo?: Partial<ICallInfo>;
  createdAt?: Date;
  updatedAt?: Date;
}
