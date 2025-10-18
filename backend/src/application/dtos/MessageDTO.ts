 import { EnumMessageType, EnumCallType, EnumCallStatus } from "@constants/enum/messageEnum";
 
export interface SendMessageDTO {
  roomId?: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type?: EnumMessageType;
  attachments?: string[];
  callInfo?: {
    callType:EnumCallType
    status: EnumCallStatus
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
    callerId: string;
    receiverId: string;
  };
}
export interface UpdateMessageDTO {
  content?: string;
  isRead?: boolean;
  readBy?: string[];
  mediaUrl?: string;
  callInfo?: Partial<CallInfoDTO>; //  allows partial updates like { status: "missed" }
}
export interface CallInfoDTO {
  callType: EnumCallType;
  status: EnumCallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  callerId: string;
  receiverId: string;
}

export interface MessageSenderDTO {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface MessageResponseDTO {
  _id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: EnumMessageType;
  mediaUrl?: string;
  isRead: boolean;
  readBy: string[];
  callInfo?: Partial<CallInfoDTO>;
  createdAt: Date;
  updatedAt: Date;
}


export interface MessagePopulatedResponseDTO {
  _id: string;
  roomId: string;
  senderId: MessageSenderDTO;
  content: string;
  type: EnumMessageType;
  mediaUrl?: string;
  isRead: boolean;
  readBy: string[];
  callInfo?: Partial<CallInfoDTO>;
  createdAt: Date;
  updatedAt: Date;
}
