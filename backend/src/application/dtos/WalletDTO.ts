import { EnumWalletTransactionType } from "@constants/enum/walletEnum";

export interface WalletTransactionDTO {
  type: EnumWalletTransactionType;
  amount: number;
  description?: string;
  createdAt: Date;
}

export interface WalletResponseDTO {
  _id: string;
  userId: string;
  balance: number;
  transactions: WalletTransactionDTO[];
  createdAt: Date;
  updatedAt: Date;
}
 