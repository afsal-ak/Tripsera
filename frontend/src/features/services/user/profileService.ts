import userApi from '@/lib/axios/userAxios';
import type { ProfileFormSchema } from '@/features/schemas/ProfileFormSchema';
import type { AddressFormSchema } from '@/features/schemas/AddressFormSchema';

export const updateProfilepic = async (formData: FormData) => {
  const response = await userApi.put('/profile/uploadProfileImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadCoverpic = async (formData: FormData) => {
  const response = await userApi.put('/profile/uploadCoverImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const updateUserProfile = async (profileData: ProfileFormSchema) => {
  const response = await userApi.put('/profile/update', { profileData });
  return response.data;
};
export const updateUserAddress = async (address: AddressFormSchema) => {
  const response = await userApi.put('/profile/updateAddress', { address });
  console.log(response);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await userApi.get('/profile');
  return response.data;
};

export const requestEmailChange = async (newEmail: string) => {
  const response = await userApi.post('/email/request-change', { newEmail });
  return response.data;
};

export const emailChange = async (newEmail: string, otp: string) => {
  const response = await userApi.post('/email/verify-change', { newEmail, otp });
  return response.data;
};

export const passwordChange = async (currentPassword: string, newPassword: string) => {
  const response = await userApi.post('/password/change', { currentPassword, newPassword });
  return response.data;
};

