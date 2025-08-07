import { IWallet, IWalletTransaction } from '@domain/entities/IWallet';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { WalletModel } from '@infrastructure/models/Wallet';
import { AppError } from '@shared/utils/AppError';

export class WalletRepository implements IWalletRepository {
  async walletBalance(userId: string): Promise<{ balance: number }> {
    const wallet = await WalletModel.findOne({ userId }).lean();
    return { balance: wallet?.balance || 0 };
  }

  async getUserWallet(
    userId: string,
    options?: { page?: number; limit?: number; sort?: 'newest' | 'oldest' }
  ): Promise<{
    balance: number;
    transactions: IWalletTransaction[];
    total: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sortOrder = options?.sort || 'newest';

    let wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      wallet = await WalletModel.create({
        userId: userId,
        balance: 0,
      });
      throw new AppError(400, 'wallet not found');
    }

    const sorted = [...wallet.transactions].sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const paginated = sorted.slice(skip, skip + limit);

    return {
      balance: wallet.balance,
      transactions: paginated,
      total: wallet.transactions.length,
    };
  }

  async createWallet(userId: string): Promise<IWallet> {
    const existing = await WalletModel.findOne({ userId });
    if (existing) {
      return existing.toObject();
    }
    const createWallet = await WalletModel.create({
      userId,
      balance: 0,
      transactions: [],
    });

    return createWallet.toObject();
  }

  async creditWallet(userId: string, amount: number, description?: string): Promise<IWallet> {
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      throw new AppError(400, 'Wallet not found');
    }
    wallet.balance += amount;
    wallet.transactions.push({
      type: 'credit',
      amount,
      description,
      createdAt: new Date(),
    });
    await wallet.save();

    return wallet.toObject();
  }

  async debitWallet(userId: string, amount: number, description?: string): Promise<IWallet> {
    const wallet = await WalletModel.findOne({ userId });
    if (!wallet) {
      throw new AppError(400, 'Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new AppError(400, 'Insufficient wallet balance');
    }
    wallet.balance -= amount;

    wallet.transactions.push({
      type: 'debit',
      amount,
      description,
      createdAt: new Date(),
    });
    await wallet.save();

    return wallet.toObject();
  }
}
