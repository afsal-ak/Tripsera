import { IWalletTransaction } from '@domain/entities/IWallet';
import { IWalletRepository } from '@domain/repositories/IWalletRepository';
import { IWalletUseCases } from '@application/useCaseInterfaces/user/IWalletUseCases';
import { WalletResponseDTO } from '@application/dtos/WalletDTO';
import { WalletMapper } from '@application/mappers/WalletMapper';
 export class WalletUseCases implements IWalletUseCases {
  constructor(private _walletRepo: IWalletRepository) { }

  async createWallet(userId: string): Promise<WalletResponseDTO> {
    const wallet = await this._walletRepo.createWallet(userId);
    return WalletMapper.toResponseDTO(wallet)
  }

  async walletBalance(userId: string): Promise<{ balance: number; }> {
    return await this._walletRepo.walletBalance(userId);
  }


  async getUserWallet(
    userId: string,
    options?: { page: number; limit: number; sort:string}
  ): Promise<{
    balance: number;
    transactions: IWalletTransaction[];
    total: number;
  }> {
    const result = await this._walletRepo.getUserWallet(userId, options);
    return {
      transactions: result.transactions.map(WalletMapper.toTransactionDTO),
      balance: result.balance,
      total: result.total
    }
  }

  async creditWallet(userId: string, amount: number, description: string): Promise<WalletResponseDTO> {
    const wallet = await this._walletRepo.creditWallet(userId, amount, description);
    return WalletMapper.toResponseDTO(wallet)

  }
  async debitWallet(userId: string, amount: number, description: string): Promise<WalletResponseDTO> {
    const wallet = await this._walletRepo.debitWallet(userId, amount, description);
    return WalletMapper.toResponseDTO(wallet)

  }
}
