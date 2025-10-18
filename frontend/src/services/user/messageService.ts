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

export const fetchHistory = async (roomId: string) => {
  const res = await api.get(`/user/chat/${roomId}/history`);
  console.log(res, 'callhistory');
  return res.data.data;
};

export const deleteUserRoom = async (roomId: string) => {
  const response = await api.delete(`/user/chatrooms/${roomId}`);
  return response.data;
};

export const getChatRoomById = async (roomId: string) => {
  const response = await api.get(`/user/chatrooms/${roomId}`);
  return response.data;
};

export const getUserRoom = async (filters?: IChatRoomFilter) => {
  const response = await api.get(`/user/chatrooms`, {
    params: filters,
  });
  return response.data;
};
export const getMessagesByRoom = async (roomId: string) => {
  const response = await api.get(`/user/chatrooms/${roomId}/messages`);
  return response.data;
};

export const uploadFile = async (formData: FormData) => {
  const response = await api.post('/admin/messages/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response, 'response chat');
  return response.data;
};
