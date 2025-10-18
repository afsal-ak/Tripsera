import { Schema, model, Document } from 'mongoose';
import { IComment } from '@domain/entities/IComment';
import { EnumParentType } from '@constants/enum/commentEnum';

type CommentDocument = IComment & Document;

const CommentSchema = new Schema<CommentDocument>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'parentType',
    },
    parentType: {
      type: String,
      enum: Object.values(EnumParentType),
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);

export const CommentModel = model<CommentDocument>('Comment', CommentSchema);
