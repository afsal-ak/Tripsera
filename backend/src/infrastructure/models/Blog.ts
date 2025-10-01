import mongoose, { Schema, model, Document } from 'mongoose';
import { IBlog } from '@domain/entities/IBlog';
import slugify from 'slugify';


type BlogDocument=IBlog&Document

const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
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

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  },
  { timestamps: true }
);

BlogSchema.pre('save', async function (next) {
  // Only regenerate slug if title is new or changed
  if (!this.isModified('title')) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Check if slug already exists
  while (await BlogModel.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

export const BlogModel = model<BlogDocument>('Blog', BlogSchema);
