import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IRazorpayService } from '@domain/entities/IRazorpayService';
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export class RazorpayService implements IRazorpayService {
  async createOrder(
    amount: number,
    receipt: string
  ): Promise<{
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  }> {
    const amountInPaise = Number(amount) * 100;
    const receiptId = String(receipt);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
    });

    return {
      id: String(order.id),
      amount: Number(order.amount),
      currency: String(order.currency),
      receipt: String(order.receipt ?? ''),
    };
  }

  async verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean> {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY as string)
      .update(body)
      .digest('hex');

    return expectedSignature === razorpaySignature;
  }
}
