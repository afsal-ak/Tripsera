// import { IMessage } from "@domain/entities/IMessage";

// export interface SendMessageDTO {
//   roomId: string;
//   senderId?: string;
//   receiverId?:string;
//   content: string;
//   type?: "text" | "image" | "file" | "blog" | "package";
//   attachments?: string[];
// }

// export interface UpdateMessageDTO {
//   content?: string;
//   attachments?: string[];
//   isRead?: boolean;
//   readBy?: string[];
// }

// export interface MessageResponseDTO {
//   _id: string;
//   roomId: string;
//   senderId: string;
//   content: string;
//   type: "text" | "image" | "file" | "blog" | "package";
//   attachments: string[];
//   isRead: boolean;
//   readBy: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const toMessageResponseDTO = (message: IMessage): MessageResponseDTO => {
//   return {
//     _id: message._id!.toString(),
//     roomId: message.roomId.toString(),
//     senderId: message.senderId.toString(),
//     content: message.content,
//     type: message.type || "text",
//     attachments: message.attachments || [],
//     isRead: message.isRead ?? false,
//     readBy: message.readBy ? message.readBy.map((id) => id.toString()) : [],
//     createdAt: message.createdAt!,
//     updatedAt: message.updatedAt!,
//   };
// };
import { IMessage } from "@domain/entities/IMessage";

export type MessageType = "text" | "image" | "file" | "blog" | "package";

// export interface SendMessageDTO {
//   roomId?: string;             
//   senderId: string;
//   receiverId?: string;          
//   type?: MessageType;
//   attachments?: string[];
// }
export interface SendMessageDTO {
  roomId?: string;             // If provided, use existing room
  senderId: string;            // Logged-in user
  receiverId?: string;         // Needed when creating a new room
  content: string;             // Message text/content
  type?: MessageType;          // Default: "text"
  attachments?: string[];      // For images, files, etc.
}
export interface UpdateMessageDTO {
  content?: string;
  attachments?: string[];
  isRead?: boolean;
  readBy?: string[];
}

export interface MessageResponseDTO {
  _id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments: string[];
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const toMessageResponseDTO = (message: IMessage): MessageResponseDTO => {
  return {
    _id: message._id!.toString(),
    roomId: message.roomId.toString(),
    senderId: message.senderId as any,
    content: message.content,
    type: message.type || "text",
    attachments: message.attachments || [],
    isRead: message.isRead ?? false,
    readBy: message.readBy ? message.readBy.map((id) => id.toString()) : [],
    createdAt: message.createdAt!,
    updatedAt: message.updatedAt!,
  };
};
