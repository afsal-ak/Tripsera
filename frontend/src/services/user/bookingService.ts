import type { BookingFormSchema } from '@/schemas/BookingSchema';
import api from '@/lib/axios/api';
import type { IBooking } from '@/types/IBooking';

// router.get('/booking',userAuthMiddleware,bookingController.getUserBookings)
// router.get('/booking/:bookingId',userAuthMiddleware,bookingController.getBookingById)
// router.patch('/booking/cancel',userAuthMiddleware,bookingController.cancelBooking)

export const getUserBooking = async (page: number, limit: number) => {
  const response = await api.get(`/user/booking?page=${page}&limit=${limit}`);
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/user/booking/${id}`);
  return response.data;
};

export const cancelBooking = async (id: string, reason: string) => {
  const response = await api.patch(`/user/booking/cancel/${id}`, { reason });
  return response.data;
};

export const applyCoupon = async (code: string, totalAmount: number) => {
  const response = await api.post('/user/coupon/apply', { code, totalAmount });
  return response.data;
};

export const createBookingWithWalletPayment = async (data: BookingFormSchema) => {
  const response = await api.post('/user/booking/wallet', data);
  console.log(response, 'create booking walet');
  return response.data;
};

export const createBookingWithOnlinePayment = async (data: BookingFormSchema) => {
  const response = await api.post('/user/booking/online', data);
  return response.data;
};

export const verifyRazorpayPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await api.post('/user/booking/verify', data);
  return res.data.success;
};

export const retryBookingPayment = async (bookingId: string): Promise<IBooking> => {
  const response = await api.post(`/user/retry-payment/${bookingId}`);
  console.log(response, 'retry');
  return response.data;
};

export const cancelUnpaidBooking = async (bookingId: string): Promise<{ message: string }> => {
  const response = await api.patch(`/user/payment-cancel/${bookingId}`);
  return response.data;
};
