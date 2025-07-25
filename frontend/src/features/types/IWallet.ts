export interface IWalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
  createdAt: Date;
}

export interface IWallet {
  balance: number;
  transactions?: IWalletTransaction[];
  createdAt: Date;
}
