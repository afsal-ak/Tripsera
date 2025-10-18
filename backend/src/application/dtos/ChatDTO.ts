

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
  unreadCounts?: Record<string, number>; // track unread for each user
 }

export interface ChatRoomParticipantDTO {
  _id: string;
  username: string;
  profileImage?: string;
}

export interface ChatRoom1to1ResponseDTO {
  _id: string;
  otherUser: ChatRoomParticipantDTO;
  lastMessageContent?: string | '';
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRoomGroupResponseDTO {
  _id: string;
  groupName: string;
  participants: ChatRoomParticipantDTO[];
  lastMessageContent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface ChatRoomFullResponseDTO {
  _id: string;
  name?: string | null;
  isGroup: boolean;
  createdBy: string; // user ID
  participants: string[]; // array of user IDs
  lastMessageContent?: string | null; // simplified last message info
  unreadCounts?: {
    [userId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
