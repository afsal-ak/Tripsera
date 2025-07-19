// features/hooks/useRazorpayPayment.ts
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyRazorpayPayment, cancelUnpaidBooking } from "@/features/services/user/bookingService";

export const useRazorpayPayment = () => {
  const navigate = useNavigate();

  const initiateRazorpayPayment = (
    razorpayOrder: any,
    booking: any,
    prefill: {
      name: string;
      email: string;
      contact: string;
    }
  ) => {
    console.log("razorpayOrder", razorpayOrder);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID_KEY,
      amount: razorpayOrder?.amount.toString()||0,
      currency: razorpayOrder.currency,
      name: "Travel Booking",
      description: "Package booking payment",
      order_id: razorpayOrder.id,
      handler: async function (response: any) {
        const verified = await verifyRazorpayPayment(response);

        if (verified) {
          toast.success("Payment successful!");
          navigate(`/booking-success/${booking.bookingCode}`);
        } else {
          toast.error("Payment verification failed.");
        }
      },
      modal: {
        ondismiss: async () => {
          try {
            await cancelUnpaidBooking(booking._id);
            navigate(`/booking-failed/${booking.bookingCode}`);
            toast.info("Payment cancelled and booking marked as cancelled.");
          } catch (error) {
            console.error("Cancel booking failed", error);
            toast.error("Failed to cancel booking. Try again.");
          }
        }
      },
      prefill,
      theme: { color: "#F97316" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { initiateRazorpayPayment };
};
