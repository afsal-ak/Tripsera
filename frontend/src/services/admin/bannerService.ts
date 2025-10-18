import api from '@/lib/axios/api';
export const fetchBannerData = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/banners?page=${page}&limit=${limit}`);
  return response.data;
};
// src/features/services/admin/bannerService.ts

export const addBanner = async (formData: FormData) => {
  const response = await api.post('/admin/addBanner', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const blockBanner = async (id: string) => {
  try {
    const response = await api.patch(`/admin/banners/${id}/block`);

    return response.data;
  } catch (error) {
    console.error('Failed to block banner', error);
  }
};
export const unBlockBanner = async (id: string) => {
  try {
    const response = await api.patch(`/admin/banners/${id}/unblock`);

    return response.data;
  } catch (error) {
    console.error('Failed to unblock banner', error);
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const response = await api.delete(`/admin/banners/${id}/delete`);

    return response.data;
  } catch (error) {
    console.error('Failed to delete banner', error);
  }
};
