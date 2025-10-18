import { WalletResponseDTO, WalletTransactionDTO } from '@application/dtos/WalletDTO';

export interface IWalletUseCases {
  createWallet(userId: string): Promise<WalletResponseDTO>;

  walletBalance(userId: string): Promise<{ balance: number }>;

  getUserWallet(
    userId: string,
    options?: { page: number; limit: number; sort: string }
  ): Promise<{
    balance: number;
    transactions: WalletTransactionDTO[];
    total: number;
  }>;

  creditWallet(userId: string, amount: number, description: string): Promise<WalletResponseDTO>;

  debitWallet(userId: string, amount: number, description: string): Promise<WalletResponseDTO>;
}
