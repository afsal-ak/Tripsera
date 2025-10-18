import { Schema, model, Types, Document } from 'mongoose';
import { IFollow } from '@domain/entities/IFollow';

type FollowDocument = IFollow & Document;

const FollowSchema = new Schema<FollowDocument>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'accepted',
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    unfollowedAt: { type: Date },
    blockedBy: { type: Types.ObjectId, ref: 'Users' },
  },
  { timestamps: true }
);

// Ensure no duplicate follow relationships
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

export const FollowModel = model<FollowDocument>('Follow', FollowSchema);
