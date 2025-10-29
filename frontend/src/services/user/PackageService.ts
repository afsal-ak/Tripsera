import type{ IPackage } from '@/types/IPackage';
import api from '@/lib/axios/api';

interface PackageQueryParams {
  location?: string;
  category?: string;
  duration?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchActivePackages = async (
  params: PackageQueryParams
)=>{
  const res = await api.get('/user/packages', { params });
  console.log(res,'inn pacaksd');
  
  return res.data.data;
};

export const fetchPackgeById = async (id: string): Promise<IPackage> => {
  const res = await api.get(`/user/packages/${id}`);
  return res.data.packages;
};
