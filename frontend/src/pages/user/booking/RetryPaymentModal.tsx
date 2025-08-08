import { useState } from 'react';
import { cancelUnpaidBooking, retryBookingPayment } from '@/services/user/bookingService';
import { useRazorpayPayment } from '@/hooks/initiateRazorpayPayment';
import type { IBooking } from '@/types/IBooking';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/Button';
import { toast } from 'sonner';

interface RetryPaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  onRetrySuccess: (updatedBooking: IBooking) => void;
}

export const RetryPaymentModal: React.FC<RetryPaymentModalProps> = ({
  open,
  onClose,
  bookingId,
  prefill,
  onRetrySuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { initiateRazorpayPayment } = useRazorpayPayment();

  const handleRetryPayment = async () => {
    try {
      const razorpayOrderData: any = await retryBookingPayment(bookingId);
      //  const razorpayOrder = updatedBooking.razorpay?.orderId;
      const { booking, razorpayOrder } = razorpayOrderData;

      // Use prefill from props
      initiateRazorpayPayment(razorpayOrder, booking, prefill);

      onRetrySuccess(booking);
    } catch (error: any) {
      console.error('Retry payment failed', error?.response || error);
      toast.error('Retry failed. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    setLoading(true);
    setError('');
    try {
      await cancelUnpaidBooking(bookingId);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <p>Would you like to retry the payment or cancel the booking?</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancelBooking} disabled={loading}>
            Cancel Booking
          </Button>
          <Button onClick={handleRetryPayment} disabled={loading}>
            {loading ? 'Processing...' : 'Retry Payment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
