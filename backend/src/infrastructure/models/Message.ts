
import { Schema, model, Document } from "mongoose";
import { IMessage } from "@domain/entities/IMessage";

type MessageDocument = IMessage & Document;

const messageSchema = new Schema<MessageDocument>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "blog", "package", "audio"],
      default: "text",
    },

    // attachments: [
    //   {
    //     type: String,
    //   },
    // ],


    mediaUrl: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model<MessageDocument>("Message", messageSchema);
