// export enum EnumWalletTransactionType {
//   CREDIT = 'credit',
//   DEBIT = 'debit',
// }

//  Wallet Transaction Type
export const EnumWalletTransactionType = {
  CREDIT: 'credit',
  DEBIT: 'debit',
} as const;
export type EnumWalletTransactionType = (typeof EnumWalletTransactionType)[keyof typeof EnumWalletTransactionType];