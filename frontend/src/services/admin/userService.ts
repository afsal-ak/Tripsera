import api from '@/lib/axios/api';
 import type { IFilter } from '@/types/IFilter';

export const fetchUsersData = async (filters:IFilter) => {
  let params={
   ...filters
  }
  const response = await api.get(`/admin/users`,{params});
  return response.data.data;
};

export const fetchUserDetails = async (id:string) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};
 
export const toggleBlockUser = async (userId: string) => {
  return api.patch(`/admin/users/${userId}/toggle-block`);
};

export const handleSearchUser = async (search:string) => {
  const response = await api.get(`/admin/users/search-all?search=${search}`);
  return response.data;
};