import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@domain/entities/IUser';
import { EnumUserRole, EnumGender } from '@constants/enum/userEnum';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    password: { type: String },
    role: { 
      type: String, 
      enum: Object.values(EnumUserRole), 
      default: EnumUserRole.USER 
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'Users', default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: 'Users', default: [] }],
    isPrivate: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    fullName: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: Object.values(EnumGender) },
    profileImage: { url: String, public_id: String },
    coverImage: { url: String, public_id: String },
    bio: { type: String },
    links: [{ platform: String, url: String }],
    interests: { type: [String] },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    referralCode: { type: String, unique: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    googleId: String,
    isGoogleUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('Users', UserSchema);
