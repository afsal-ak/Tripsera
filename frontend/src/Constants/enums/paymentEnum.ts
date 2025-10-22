
// ✅ Payment Status
export const EnumPaymentStatus = {
  PAID: 'paid',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;
export type EnumPaymentStatus = (typeof EnumPaymentStatus)[keyof typeof EnumPaymentStatus];

// ✅ Payment Method
export const EnumPaymentMethod = {
  RAZORPAY: 'razorpay',
  WALLET: 'wallet',
  WALLET_RAZORPAY: 'wallet+razorpay',
} as const;
export type EnumPaymentMethod = (typeof EnumPaymentMethod)[keyof typeof EnumPaymentMethod];

