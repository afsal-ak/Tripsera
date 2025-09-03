
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
} as const;

export type IMessageType = (typeof MessageType)[keyof typeof MessageType];
// senderId: {
//       _id: new ObjectId('683f1be1fea446657f9be6f7'),
//       username: 'afsalak3',
//       profileImage: [Object]
//     },

export interface ISender{
  _id: string,
      username?:string,
 profileImage?: {
    url: string;
    public_id: string;
  };}


export interface IMessage {
  _id: string;
  roomId: string;
  sender: ISender  
  content: string;
  type: IMessageType;
  attachments: string[];
  isRead: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISendMessage {
  roomId?: string;             // If provided, use existing room
  senderId: string;            // Logged-in user
  receiverId?: string;         // Needed when creating a new room
  content: string;             // Message text/content
  type?: IMessageType;          // Default: "text"
  attachments?: string[];      // For images, files, etc.
}