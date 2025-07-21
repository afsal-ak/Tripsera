import mongoose, { Schema, model, Document } from 'mongoose';
import { IBlog } from '@domain/entities/IBlog';

interface BlogDocument extends Omit<IBlog, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}


const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
   // slug: { type: String, required: false, unique: true },
    content: { type: String, required: true },
    coverImage: {
      url: String,
      public_id: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    tags: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    //   userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
   
     status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Users' }],

  },
  { timestamps: true }
);

export const BlogModel = model<BlogDocument>('Blog', BlogSchema);
