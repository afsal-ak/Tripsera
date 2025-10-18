export interface IChatParticipant {
  _id: string;
  username: string;
  avatar?: string;
  profileImage?: string;

  isOnline?: boolean;
  location?: string;
}

export interface IChatRoom {
  _id: string;
  name?: string;
  participants: IChatParticipant[];
  otherUser?: IChatParticipant;
  createdBy: string;
  isGroup: boolean;
  lastMessageContent?: string;
  unreadCounts?: {
    [userId: string]: number;
  };
  totalUnread?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const IMessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  AUDIO: 'audio',
  CALL: 'call',
} as const;
export type IMessageType = (typeof IMessageType)[keyof typeof IMessageType];

export interface ISender {
  _id: string;
  username?: string;
  profileImage?: {
    url: string;
    public_id: string;
  };
}

export interface ICallInfo {
  callType: 'audio' | 'video';
  status: 'initiated' | 'answered' | 'missed' | 'ended' | 'cancelled';
  duration: string;
  startedAt?: Date;
  endedAt?: Date;
  callerId: string;
  receiverId: string;
}
export interface IMessage {
  _id: string;
  roomId: string;
  senderId: ISender;
  content: string;
  type?: IMessageType;
  mediaUrl?: string;
  isRead?: boolean;
  readBy?: string[];
  callInfo?: Partial<ICallInfo>; //  changed

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
