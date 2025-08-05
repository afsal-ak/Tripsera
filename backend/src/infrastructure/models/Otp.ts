import { Schema, Document, model } from 'mongoose';
import { IOTP } from '@domain/entities/IOTP';

export interface IOtpDocument extends IOTP, Document {}

const OtpSchema = new Schema<IOtpDocument>({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
   referredReferralCode:{
    type:String,
    default:null
   },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: { type: Date, required: true },
});

// TTL index to auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = model<IOtpDocument>('Otp', OtpSchema);
