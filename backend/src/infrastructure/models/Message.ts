

// import { Schema, model, Document } from "mongoose";
// import { IMessage } from "@domain/entities/IMessage";

// type MessageDocument = IMessage & Document;

// const callInfoSchema = new Schema(
//   {
//     callType: {
//       type: String,
//       enum: ["audio", "video"],
//     },
//     status: {
//       type: String,
//       enum: ["initiated", "answered", "missed", "ended",'rejected','cancelled'],
//       default: "initiated",
//     },
//     startedAt: { type: Date },
//     endedAt: { type: Date },
//     duration: { type: Number },
//     callerId: {
//       type: Schema.Types.ObjectId,
//       ref: "Users",
//     },
//     receiverId: {
//       type: Schema.Types.ObjectId,
//       ref: "Users",
//     },
//   },
//   { _id: false }
// );

// const messageSchema = new Schema<MessageDocument>(
//   {
//     roomId: {
//       type: Schema.Types.ObjectId,
//       ref: "ChatRoom",
//       required: true,
//     },

//     senderId: {
//       type: Schema.Types.ObjectId,
//       ref: "Users",
//       required: true,
//     },

//     content: {
//       type: String,
//       default: "",
//     },

//     type: {
//       type: String,
//       enum: [
//         "text",
//         "image",
//         "file",
//         "blog",
//         "package",
//         "audio",
//         "call", // ✅ Added call message type
//       ],
//       default: "text",
//     },

//     mediaUrl: {
//       type: String,
//       default: "",
//     },

//     isRead: {
//       type: Boolean,
//       default: false,
//     },

//     readBy: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Users",
//       },
//     ],

//     //  Optional call info (only for type = "call")
//     callInfo: {
//       type: callInfoSchema,
//       required: function (this: any) {
//         return this.type === "call";
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const MessageModel = model<MessageDocument>("Message", messageSchema);

import { Schema, model, Document } from "mongoose";
import { IMessage } from "@domain/entities/IMessage";
import { EnumCallStatus, EnumCallType, EnumMessageType } from "@constants/enum/messageEnum";

type MessageDocument = IMessage & Document;

const callInfoSchema = new Schema(
  {
    callType: {
      type: String,
      enum: Object.values(EnumCallType), // use Enum values
    },
    status: {
      type: String,
      enum: Object.values(EnumCallStatus), // use Enum values
      default: EnumCallStatus.INITIATED,
    },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number },
    callerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { _id: false }
);

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
      enum: Object.values(EnumMessageType),  
      default: EnumMessageType.TEXT,
    },

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

    // Optional call info (only for type = "call")
    callInfo: {
      type: callInfoSchema,
      required: function (this: any) {
        return this.type === EnumMessageType.CALL;
      },
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model<MessageDocument>("Message", messageSchema);
