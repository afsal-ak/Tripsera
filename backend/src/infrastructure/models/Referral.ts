import { Schema, model, Document } from 'mongoose';
import { IReferral } from '@domain/entities/IReferral';

type ReviewDocument = IReferral & Document;

const referralSchema = new Schema<ReviewDocument>(
  {
    amount: {
      type: Number,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const referralModel = model<ReviewDocument>('Referral', referralSchema);
