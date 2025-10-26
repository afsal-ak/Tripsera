import type { BookingFormSchema } from '@/schemas/BookingSchema';
import api from '@/lib/axios/api';
import type { IBooking } from '@/types/IBooking';

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
  console.log(response,'booking cancel response');
  
  return response.data.data;
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

export const downloadInvoice = async (bookingId: string) => {
  try {
    console.log(bookingId);
    const response = await api.get(`/user/booking/invoice/${bookingId}/download`, {
      responseType: 'blob',
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${bookingId}.pdf`); // filename
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading invoice', error);
  }
};

export const removeTraveler = async (
  bookingId: string,
  travelerIndex: number,
  note?: string
): Promise<any> => {
  const response = await api.put(`/user/booking/${bookingId}/remove-traveler`, {
    travelerIndex,
    note,
  });
  return response.data;
};

export const changeTravelDate = async (
  bookingId: string,
  newDate: string | Date,
  note?: string
) => {
  const response = await api.put(`/user/booking/${bookingId}/change-travel-date`, {
    newDate,
    note,
  });
  return response.data;
};
