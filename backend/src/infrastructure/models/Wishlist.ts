import { model, Document, Schema } from 'mongoose';
import { IWishlist } from '@domain/entities/IWishlist';

export interface IWishlistDocument extends IWishlist, Document {}

const wishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const WishlistModel = model<IWishlistDocument>('Wishlist', wishlistSchema);
