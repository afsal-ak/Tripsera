import api from '@/lib/axios/api';

export const fetchUsersData = async (page = 1, limit = 5) => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return response.data;
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