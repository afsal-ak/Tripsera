import { Types } from 'mongoose';

export interface IWalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
  createdAt: Date;
}

export interface IWallet {
  _id:string|Types.ObjectId ,
  userId: Types.ObjectId | string;
  balance: number;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}
