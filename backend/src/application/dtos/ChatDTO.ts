import { IChatRoom } from "@domain/entities/IChatRoom";
import { IMessage } from "@domain/entities/IMessage";

export interface CreateChatRoomDTO {
  name?: string; // For group chats
  participants: string[]; // User/Admin IDs
  isGroup: boolean;
  createdBy: string;
}

export interface UpdateChatRoomDTO {
  name?: string;
  participants?: string[];
  lastMessage?:string;
  lastMessageContent?:string;
}
// export interface ChatParticipantDTO {
//   _id: string;
//   username: string;
//   profileImage?: string;
//   lastMessageContent?: string;
// }

// export interface ChatRoomResponseDTO {
//   _id: string;
//   name?: string;
//   participants: ChatParticipantDTO[]; 
//   createdBy: string;
//   isGroup: boolean;
// lastMessageContent?:string;
//   unreadCounts?: {
//     [userId: string]: number;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const toChatRoomResponseDTO = (
//   room: IChatRoom,
// ): ChatRoomResponseDTO => {
//   return {
//     _id: room._id!.toString(),
//     name: room.name,
//     participants: room.participants as any,
//     createdBy: room.createdBy.toString(),
//     isGroup: room.isGroup,
//     lastMessageContent:room?.lastMessageContent,
//     unreadCounts: room.unreadCounts,
//     createdAt: room.createdAt!,
//     updatedAt: room.updatedAt!,
//   };
// };

export interface ChatParticipantDTO {
  _id: string;
  username: string;
  profileImage?: {
    url: string;
    public_id: string;
  } | null;
}

export interface ChatRoomResponseDTO {
  _id: string;
  name?: string | null;
  participants: ChatParticipantDTO[] | ChatParticipantDTO; // can be single object for 1-to-1
  createdBy: string;
  isGroup: boolean;
  lastMessageContent?: string | null;
  unreadCounts?: {
    [userId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
export const toChatRoomResponseDTO = (
  room: IChatRoom,
 ): ChatRoomResponseDTO => {
  const participants = Array.isArray(room.participants)
    ? (room.participants as any[]).map((p) => ({
        _id: p._id.toString(),
        username: p.username,
        profileImage: p.profileImage || null,
      }))
    : [];


  return {
    _id: room._id!.toString(),
    name: room.name || null,
    participants: participants,
    createdBy: room.createdBy.toString(),
    isGroup: room.isGroup,
    lastMessageContent: room?.lastMessageContent || null,
    unreadCounts: room.unreadCounts || {},
    createdAt: room.createdAt!,
    updatedAt: room.updatedAt!,
  };
};
