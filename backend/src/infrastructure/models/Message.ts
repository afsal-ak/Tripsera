// import { Schema, model, Document } from "mongoose";
// import { IMessage } from "@domain/entities/IMessage";

//  type MessageDocument = IMessage& Document 
 
// const messageSchema = new Schema<MessageDocument>(
//   {
//     roomId: {
//       type: Schema.Types.ObjectId,
//       ref: "ChatRoom",//for chat group name
//       required: true,
//     },
//     senderId: {
//       type: Schema.Types.ObjectId,
//       ref: "Users", // Could also reference Admin if needed
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["text", "image", "file"],
//       default: "text",
//     },
//     attachments: [
//       {
//         type: String,
//       },
//     ],
//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//     readBy: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// export const MessageModel = model<MessageDocument>("Message", messageSchema);
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
      default: "", // ✅ Allow empty if attachments-only message
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "blog", "package"], // ✅ Keep interface & schema consistent
      default: "text",
    },

    attachments: [
      {
        type: String,
      },
    ],

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
