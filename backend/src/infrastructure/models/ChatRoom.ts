import { Schema, model, Document } from 'mongoose';
import { IChatRoom } from '@domain/entities/IChatRoom';

type ChatRoomDocument = IChatRoom & Document;

const chatRoomSchema = new Schema<ChatRoomDocument>(
  {
    name: { type: String },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users', //
        required: true,
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },

    lastMessageContent: {
      type: String,
      default: '',
    },

    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const ChatRoomModel = model<ChatRoomDocument>('ChatRoom', chatRoomSchema);
