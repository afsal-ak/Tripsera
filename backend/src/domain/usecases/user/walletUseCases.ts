import { MongoWalletRepository } from "@infrastructure/repositories/MongoWalletRepository ";
import { IWallet, IWalletTransaction } from "@domain/entities/IWallet";
import { IWishlist } from "@domain/entities/IWishlist";


export class WalletUseCases {
    constructor(private walletRepo: MongoWalletRepository) { }

    async createWallet(userId: string): Promise<IWallet> {
        return await this.walletRepo.createWallet(userId)
    }

    async getUserWallet(
        userId: string,
        options?: {page: number; limit: number; sort: "newest" | "oldest"
        }): Promise<{
            balance: number;
            transactions: IWalletTransaction[];
            total: number;
        } > {
        return await this.walletRepo.getUserWallet(userId, options)
    }

    async creditWallet(userId: string, amount: number, description: string): Promise<IWallet> {
        return await this.walletRepo.creditWallet(userId, amount, description)
    }
    async debitWallet(userId: string, amount: number, description: string): Promise<IWallet> {
        return await this.walletRepo.debitWallet(userId, amount, description)
    }
}