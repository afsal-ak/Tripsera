import { Schema, model, Document } from "mongoose";
import { ICall } from "@domain/entities/ICall";

const callSchema = new Schema<ICall>(
  {
    callerId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    callType: { type: String, enum: ["audio", "video"], default: "video" },
    status: {
      type: String,
      enum: ["initiated", "answered", "missed", "ended"],
      default: "initiated",
    },
    startedAt: Date,
    endedAt: Date,
    duration: Number,
  },
  { timestamps: true }
);

export const CallModel = model<ICall>("Call", callSchema);
