import { IWallet,IWalletTransaction } from "@domain/entities/IWallet";
import { WalletResponseDTO, WalletTransactionDTO } from "@application/dtos/WalletDTO";
import { EnumWalletTransactionType } from "@constants/enum/walletEnum";

export class WalletMapper {
  static toResponseDTO(wallet: IWallet): WalletResponseDTO {
    return {
      _id: wallet._id.toString(),
      userId: wallet.userId.toString(),
      balance: wallet.balance,
      transactions: wallet.transactions.map(
        (t): WalletTransactionDTO => ({
          type: t.type as EnumWalletTransactionType,
          amount: t.amount,
          description: t.description,
          createdAt: t.createdAt,
        })
      ),
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }
  static toTransactionDTO(transaction: IWalletTransaction): WalletTransactionDTO {
    return {
      type: transaction.type as EnumWalletTransactionType,
      amount: transaction.amount,
      description: transaction.description,
      createdAt: transaction.createdAt,
    };
  }
}
