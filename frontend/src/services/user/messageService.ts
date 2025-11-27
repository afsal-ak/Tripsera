import api from '@/lib/axios/api';
import type { IChatRoomFilter } from '@/types/IChatRoom';

interface CreateChatRoomPayload {
  participants: string[];
  name?: string;
  isGroup: boolean;
}

export const createChatRoom = async (payload: CreateChatRoomPayload) => {
  const response = await api.post('/user/chatrooms', payload);
  return response.data;
};

export const updateUserRoom = async (roomId: string) => {
  const response = await api.post(`/user/chatrooms/${roomId}`);
  return response.data;
};



export const deleteUserRoom = async (roomId: string) => {
  const response = await api.delete(`/user/chatrooms/${roomId}`);
  return response.data;
};

export const getChatRoomById = async (roomId: string) => {
  const response = await api.get(`/user/chatrooms/${roomId}`);
  return response.data;
};
export const userTotalChatUnreadCount= async () => {
  const response = await api.get(`/user/count/chatrooms`);
  return response.data;
};


export const getUserRoom = async (filters?: IChatRoomFilter) => {
  const response = await api.get(`/user/chatrooms`, {
    params: filters,
  });
  return response.data;
};
// export const getMessagesByRoom = async (roomId: string) => {
//   const response = await api.get(`/user/chatrooms/${roomId}/messages`);
//   return response.data;
// };
export const getMessagesByRoom = async (roomId: string,page:number,limit:number) => {
  const params = {
    page,
    limit,
   };
  const response = await api.get(`/user/chatrooms/${roomId}/messages`,{params});
  return response.data;
};

export const uploadFile = async (formData: FormData) => {
  const response = await api.post('/user/messages/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response, 'response chat');
  return response.data;
};



export const handleSearchUser = async (search: string) => {
  const response = await api.get(`/user/users/search-all?search=${search}`);
  return response.data;
};