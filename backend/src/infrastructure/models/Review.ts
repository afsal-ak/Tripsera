import { Schema, model, Document } from 'mongoose';
import { IReview } from '@domain/entities/IReview';

type ReviewDocument = IReview & Document;

const ReviewSchema = new Schema<ReviewDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    username: { type: String, required: false },

    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    packageTitle: { type: String, required: false },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ReviewModel = model<ReviewDocument>('Review', ReviewSchema);
