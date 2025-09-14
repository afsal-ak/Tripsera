
export interface IChatParticipant {
  _id: string;
  username: string;
  avatar?: string;
  profileImage?: {
    url: string;
    public_id: string;
  };
  isOnline?: boolean;
  location?: string;
}

export interface IChatRoom {
  _id: string;
  name?: string;
  participants: IChatParticipant[];
  otherUser?: IChatParticipant
  createdBy: string;
  isGroup: boolean;
  lastMessageContent?: string;
  unreadCounts?: {
    [userId: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  AUDIO: 'audio',
} as const;

export type IMessageType = (typeof MessageType)[keyof typeof MessageType];
// senderId: {
//       _id: new ObjectId('683f1be1fea446657f9be6f7'),
//       username: 'afsalak3',
//       profileImage: [Object]
//     },

export interface ISender {
  _id: string,
  username?: string,
  profileImage?: {
    url: string;
    public_id: string;
  };
}


export interface IMessage {
  _id: string;
  roomId: string;
  senderId: ISender
  content?: string;
  type: IMessageType;
  mediaUrl?: string;
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISendMessage {
  roomId?: string;
  senderId: string;
  receiverId?: string;
  content?: string;
  type?: IMessageType;
  mediaUrl?: string;
}

export interface IMessageUserInfo {
  _id?: string;
  username?: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
  isBlocked?: boolean;
  fullName?: string;
  dob?: Date;
  gender?: 'male' | 'female';
  profileImage?: {
    url: string;
    public_id: string;
  };



}