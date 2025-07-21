import mongoose, { Schema, model, Document, Types } from 'mongoose';
import { IComment, IReply } from '@domain/entities/IComment';


export interface CommentDocument extends Omit<IComment, '_id'>, Document {
    _id: Types.ObjectId;
}

const ReplySchema = new Schema<IReply>(
    {
        user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: true }
);


// CommentSchema
const CommentSchema = new Schema<CommentDocument>(
    {
        blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        text: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
        replies: { type: [ReplySchema], default: [] },
    },
    { timestamps: true }
);

export const CommentModel = model<CommentDocument>('Comment', CommentSchema);
