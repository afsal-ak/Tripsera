import { Schema, model, Document } from 'mongoose';
import { IWallet, IWalletTransaction } from '@domain/entities/IWallet';

  type IWalletDocument =IWallet& Document  
  type IWalletTransactionDocument =IWalletTransaction& Document  
//type ReviewDocument = IReview & Document;

//const ReviewSchema = new Schema<ReviewDocument>(

const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
  {
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const WalletSchema = new Schema<IWalletDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: {
    type: [WalletTransactionSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const WalletModel = model<IWalletDocument>('Wallet', WalletSchema);
