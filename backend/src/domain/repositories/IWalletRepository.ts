import { IWallet, IWalletTransaction } from '@domain/entities/IWallet';

export interface IWalletRepository {
  getUserWallet(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      sort?:string;
    }
  ): Promise<{
    balance: number;
    transactions: IWalletTransaction[];
    total: number;
  }>;

  walletBalance(userId: string): Promise<{ balance: number }>;

  createWallet(userId: string): Promise<IWallet>;
  creditWallet(userId: string, amount: number, description?: string): Promise<IWallet>;
  debitWallet(userId: string, amount: number, description?: string): Promise<IWallet>;
}
