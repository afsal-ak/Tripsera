import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Tag, Receipt } from "lucide-react";

interface PaymentBreakdownProps {
  amountPaid: number;
  paymentStatus: string;
  paymentMethod: string;
  couponCode?: string;
  walletUsed?: number;
  // Mock data for additional features
  originalAmount?: number;
  discount?: number;
  taxes?: number;
}

export function PaymentBreakdown({ 
  amountPaid, 
  paymentStatus, 
  paymentMethod,
  couponCode,
  walletUsed = 0,
  originalAmount = amountPaid + (walletUsed || 0) + 500, // Mock original amount
  discount = 500, // Mock discount
  taxes = Math.round(amountPaid * 0.12) // Mock taxes (12%)
}: PaymentBreakdownProps) {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'failed':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const subtotal = originalAmount - discount;
  const totalBeforeTax = subtotal - walletUsed;

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-ocean-primary" />
          Payment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Payment Status</span>
          <Badge className={getPaymentStatusColor(paymentStatus)}>
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </Badge>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Package Amount</span>
            <span>₹{originalAmount.toLocaleString()}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount Applied</span>
              <span>-₹{discount.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Taxes & Fees</span>
            <span>₹{taxes.toLocaleString()}</span>
          </div>
          
          {walletUsed > 0 && (
            <div className="flex justify-between text-ocean-primary">
              <span className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Wallet Used
              </span>
              <span>-₹{walletUsed.toLocaleString()}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total Paid</span>
            <span className="text-ocean-primary">₹{amountPaid.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </span>
            <span className="font-medium">{paymentMethod}</span>
          </div>
          
          {couponCode && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Coupon Applied
              </span>
              <Badge variant="secondary">{couponCode}</Badge>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {paymentStatus === 'pending' && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              Your payment is being processed. You'll receive a confirmation email once completed.
            </p>
          </div>
        )}
        
        {paymentStatus === 'failed' && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive-foreground">
              Payment failed. Please retry using the quick actions panel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}