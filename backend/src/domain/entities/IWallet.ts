import { Types } from 'mongoose';
import { EnumWalletTransactionType } from '@constants/enum/walletEnum';

export interface IWalletTransaction {
  type: EnumWalletTransactionType;
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
