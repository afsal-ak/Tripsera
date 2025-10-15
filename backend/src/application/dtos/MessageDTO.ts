
import { IMessage,IMessageType,ICallInfo } from "@domain/entities/IMessage";


// export interface SendMessageDTO {
//   roomId?: string;              
//   senderId: string;            
//   receiverId?: string;         
//   content: string;            
//   type?: IMessageType;         
//   attachments?: string[];       
// }

export interface SendMessageDTO {
  roomId?: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type?: IMessageType;
  attachments?: string[];
  callInfo?: {
    callType: "audio" | "video";
    status: "initiated" | "answered" | "missed" | "ended";
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
    callerId: string;
    receiverId: string;
  };
}
// export interface UpdateMessageDTO {
//   content?: string;
//   attachments?: string[];
//   isRead?: boolean;
//   readBy?: string[];
// }

export interface UpdateMessageDTO {
  content?: string;
  isRead?: boolean;
  readBy?: string[];
  mediaUrl?: string;
  callInfo?: Partial<ICallInfo>; // ✅ allows partial updates like { status: "missed" }
}

export interface MessageResponseDTO {
  _id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: IMessageType;
  //attachments: string[];
  mediaUrl:string;
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
  callInfo?:Partial<ICallInfo>; 
}

export const toMessageResponseDTO = (message: IMessage): MessageResponseDTO => {
  return {
    _id: message._id!.toString(),
    roomId: message.roomId.toString(),
    senderId: message.senderId as any,
    content: message.content,
    type: message.type || "text",
   // attachments: message.attachments || [],
   mediaUrl:message.mediaUrl||'',
    isRead: message.isRead ?? false,
    readBy: message.readBy ? message.readBy.map((id) => id.toString()) : [],
    callInfo:message?.callInfo!,
    createdAt: message.createdAt!,
    updatedAt: message.updatedAt!,
  };
};
