
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@domain/entities/IUser';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
 // followers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  //following: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
 // bio: String,
 // profileImage: String,
 // interests: [String],
  isBlocked: { type: Boolean, default: false },
 // dob: Date,
 // firstName: String,
 // secondName: String,
 // location: String,
  googleId: String,
},
{
    timestamps: true,  
  }
);

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('Users', UserSchema);
