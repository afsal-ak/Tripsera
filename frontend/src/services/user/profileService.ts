import api from '@/lib/axios/api';
import type { ProfileFormSchema } from '@/schemas/ProfileFormSchema';
import type { AddressFormSchema } from '@/schemas/AddressFormSchema';

export const updateProfilepic = async (formData: FormData) => {
  const response = await api.put('/user/profile/uploadProfileImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadCoverpic = async (formData: FormData) => {
  const response = await api.put('/user/profile/uploadCoverImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const updateUserProfile = async (profileData: ProfileFormSchema) => {
  const response = await api.put('/user/profile/update', { profileData });
  return response.data;
};
export const updateUserAddress = async (address: AddressFormSchema) => {
  const response = await api.put('/user/profile/updateAddress', { address });
  console.log(response);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  console.log(response, 'profile');
  return response.data;
};

export const requestEmailChange = async (newEmail: string) => {
  const response = await api.post('/user/email/request-change', { newEmail });
  return response.data;
};

export const emailChange = async (newEmail: string, otp: string) => {
  const response = await api.post('/user/email/verify-change', { newEmail, otp });
  return response.data;
};

export const passwordChange = async (currentPassword: string, newPassword: string) => {
  const response = await api.post('/user/password/change', { currentPassword, newPassword });
  return response.data;
};

//public profile

export const fetchPublicProfile = async (username: string) => {
  const response = await api.get(`/user/profile/${username}`);
  return response.data;
};

export const handleFollow = async (userId: string) => {
  const response = await api.post(`/user/follow/${userId}`);
  return response.data;
};

export const handleUnFollow = async (userId: string) => {
  const response = await api.post(`/user/unfollow/${userId}`);
  return response.data;
};

export const handleProfilePrivacy = async (isPrivate: boolean) => {
  const response = await api.patch(`/user/profile/privacy`, { isPrivate });
  return response.data;
};

export const handleSearchUserForChat = async (search: string) => {
  const response = await api.get(`/user/users/search?search=${search}`);
  return response.data;
};
