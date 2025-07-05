
import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '@domain/entities/IUser';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: { type: Number },
  password: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  followers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  
  fullName: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female'] },
  profileImage: { type: String },
  bio: { type: String },
  links: [
    {
      platform: { type: String },
      url: { type: String }
    }
  ],
 interests: {
  type: [String],
  required: false
},

  address: {
    street: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    zip: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: false
    }
  },

  googleId: String,
  isGoogleUser: {
    type: Boolean,
    default: false
  }

},
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('Users', UserSchema);
