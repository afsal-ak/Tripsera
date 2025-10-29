import type { IBanner } from '@/types/homeTypes';
import type{ IPackage } from '@/types/IPackage';
import api from '@/lib/axios/api';

export const fetchHomeData = async (): Promise<{
  result: { banners: IBanner[]; packages: IPackage[] };
}> => {
  const res = await api.get('/user/home');
  return res.data;
};
