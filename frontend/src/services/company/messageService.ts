import api from '@/lib/axios/api';
import type { IChatRoomFilter } from '@/types/IChatRoom';

interface CreateChatRoomPayload {
  participants: string[];
  name?: string;
  isGroup: boolean;
}

export const companyCreateChatRoom = async (payload: CreateChatRoomPayload) => {
  const response = await api.post('/company/chatrooms', payload);
  return response.data;
};

export const companyDeleteUserRoom = async (roomId: string) => {
  const response = await api.delete(`/company/chatrooms/${roomId}`);
  return response.data;
};


export const companyTotalChatUnreadCount= async () => {
  const response = await api.get(`/company/count/chatrooms`);
  return response.data;
};

// export const userTotalChatUnreadCount= async () => {
//   const response = await api.get(`/user/count/chatrooms`);
//   return response.data;
// };
export const companyGetChatRoomById = async (roomId: string) => {
  const response = await api.get(`/company/chatrooms/${roomId}`);
  return response.data;
};

export const companyGetUserRoom = async (filters?: IChatRoomFilter) => {
  const response = await api.get(`/company/chatrooms`, {
    params: filters, // ✅ pass query parameters
  });
  return response.data;
};


export const companyGetMessagesByRoom = async (roomId: string,page:number,limit:number) => {
  const params = {
    page,
    limit,
   };
  const response = await api.get(`/company/chatrooms/${roomId}/messages`,{params});
  return response.data;
};


export const handleSearchUser = async (search: string) => {
  const response = await api.get(`/company/users/search-all?search=${search}`);
  return response.data;
};
