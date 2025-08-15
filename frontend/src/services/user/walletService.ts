import api from '@/lib/axios/api';

export const getWallet = async (page: number, limit: number, sort: string) => {
  const response = await api.get(`/user/wallet?page=${page}&limit=${limit}&sort=${sort}`);
  return response.data;
};

export const getWalletBalance = async () => {
  const response = await api.get('/user/wallet-balance');
  return response.data;
};
