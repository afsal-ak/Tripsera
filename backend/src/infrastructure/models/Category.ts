import mongoose, { Schema } from 'mongoose';
import { ICategory } from '@domain/entities/ICategory';

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const categoryModel = mongoose.model<ICategory>('Category', categorySchema);
