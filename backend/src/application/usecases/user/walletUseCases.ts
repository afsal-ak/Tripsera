import { IWallet, IWalletTransaction } from '@domain/entities/IWallet';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { IWalletUseCases } from '@application/useCaseInterfaces/user/IWalletUseCases';

export class WalletUseCases implements IWalletUseCases {
  constructor(private walletRepo: IWalletRepository) {}

  async createWallet(userId: string): Promise<IWallet> {
    return await this.walletRepo.createWallet(userId);
  }

  async walletBalance(userId: string): Promise<{ balance: number }> {
    return await this.walletRepo.walletBalance(userId);
  }

  async getUserWallet(
    userId: string,
    options?: { page: number; limit: number; sort: 'newest' | 'oldest' }
  ): Promise<{
    balance: number;
    transactions: IWalletTransaction[];
    total: number;
  }> {
    return await this.walletRepo.getUserWallet(userId, options);
  }

  async creditWallet(userId: string, amount: number, description: string): Promise<IWallet> {
    return await this.walletRepo.creditWallet(userId, amount, description);
  }
  async debitWallet(userId: string, amount: number, description: string): Promise<IWallet> {
    return await this.walletRepo.debitWallet(userId, amount, description);
  }
}
