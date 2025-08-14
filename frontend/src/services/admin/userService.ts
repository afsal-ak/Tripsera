import adminApi from '@/lib/axios/adminAxios';

export const fetchUsersData = async (page = 1, limit = 5) => {
  const response = await adminApi.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchUserDetails = async (id:string) => {
  const response = await adminApi.get(`/users/${id}`);
  return response.data;
};
 
export const toggleBlockUser = async (userId: string) => {
  return adminApi.patch(`/users/${userId}/toggle-block`);
};
