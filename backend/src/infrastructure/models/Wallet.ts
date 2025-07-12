import mongoose, { Schema, model, Document } from "mongoose";
import { IWallet, IWalletTransaction } from "@domain/entities/IWallet";

 export interface IWalletDocument extends IWallet, Document {}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    type: {
      type: String,
      enum: ["credit", "debit"],
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

 const WalletSchema = new Schema<IWalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
  }
);

 export const WalletModel = model<IWalletDocument>("Wallet", WalletSchema);
