import adminApi from '@/lib/axios/adminAxios';

export const fetchUsersData = async (page = 1, limit = 5) => {
  const response = await adminApi.get(`/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const blockUser = async (userId: string) => {
  return adminApi.patch(`/users/${userId}/block`);
};

export const unBlockUser = async (userId: string) => {
  return adminApi.patch(`/users/${userId}/unblock`);
};
