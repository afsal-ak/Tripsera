import mongoose, { Schema, Document, Model } from "mongoose";
import { IBlock } from "@domain/entities/IBlock";

type BlockDocument=IBlock&Document

const BlockSchema = new Schema<BlockDocument>(
  {
    blocker: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blocked: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, enum: ["spam", "abuse", "other"], default: "other" },
    unblockedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // only createdAt auto
);

// prevent duplicate active blocks
BlockSchema.index({ blocker: 1, blocked: 1, unblockedAt: 1 }, { unique: true });

export const BlockModel: Model<BlockDocument> = mongoose.model("Block", BlockSchema);
