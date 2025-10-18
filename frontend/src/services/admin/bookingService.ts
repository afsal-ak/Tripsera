import api from '@/lib/axios/api';
export const getAllBooking = async (
  page: number,
  limit: number,
  packageQuery?: string,
  status?: string,
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (packageQuery) params.append('package', packageQuery);
  if (status) params.append('status', status);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get(`/admin/booking?${params.toString()}`);
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/admin/booking/${id}`);
  return response.data;
};

export const cancelBooking = async (id: string, reason: string) => {
  const response = await api.patch(`/admin/booking/cancel/${id}`, { reason });
  return response.data;
};

export const confirmBooking = async (id: string, note: string) => {
  const response = await api.put(`/admin/booking/confirm/${id}`, { note });
  return response.data;
};

export const changeTravelDate = async (
  bookingId: string,
  newDate: string | Date,
  note?: string
) => {
  const response = await api.put(`/admin/booking/${bookingId}/change-travel-date`, {
    newDate,
    note,
  });
  return response.data;
};
