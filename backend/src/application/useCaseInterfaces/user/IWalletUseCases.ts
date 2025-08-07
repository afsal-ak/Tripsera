import { IWallet, IWalletTransaction } from '@domain/entities/IWallet';

export interface IWalletUseCases {
  createWallet(userId: string): Promise<IWallet>;

  walletBalance(userId: string): Promise<{ balance: number }>;

  getUserWallet(
    userId: string,
    options?: { page: number; limit: number; sort: 'newest' | 'oldest' }
  ): Promise<{
    balance: number;
    transactions: IWalletTransaction[];
    total: number;
  }>;

  creditWallet(userId: string, amount: number, description: string): Promise<IWallet>;

  debitWallet(userId: string, amount: number, description: string): Promise<IWallet>;
}
