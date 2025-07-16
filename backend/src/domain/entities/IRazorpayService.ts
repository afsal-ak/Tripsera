export interface IRazorpayService {
  createOrder(amount: number, receipt: string): Promise<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }>;

  verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean>;
}
