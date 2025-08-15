import api from '@/lib/axios/api';

export const getAllWishlist = async (page: number, limit: number) => {
  const response = await api.get(`/user/wishlist?page=${page}&limit=${limit}`);
  return response.data;
};

export const addToWishlist = async (packageId: string) => {
  const response = await api.post('/user/wishlist/add', { packageId });
  return response.data;
};

export const checkPackageInWishlist = async (packageId: string) => {
  const response = await api.get(`/user/wishlist/check?packageId=${packageId}`);
  return response.data;
};

export const deleteFromWishlist = async (packageId: string) => {
  const response = await api.delete('/user/wishlist/delete', {
    data: { packageId },
  });
  return response.data;
};
