import api from '@/lib/axios/api';
import type { IChatRoomFilter } from '@/types/IChatRoom';

interface CreateChatRoomPayload {
  participants: string[];
  name?: string;
  isGroup: boolean;
}

export const adminCreateChatRoom = async (payload: CreateChatRoomPayload) => {
  const response = await api.post('/admin/chatrooms', payload);
  return response.data;
};

export const adminDeleteUserRoom = async (roomId: string) => {
  const response = await api.delete(`/admin/chatrooms/${roomId}`);
  return response.data;
};

export const adminGetChatRoomById = async (roomId: string) => {
  const response = await api.get(`/admin/chatrooms/${roomId}`);
  return response.data;
};

export const adminGetUserRoom = async (filters?: IChatRoomFilter) => {
  const response = await api.get(`/admin/chatrooms`, {
    params: filters, // ✅ pass query parameters
  });
  return response.data;
};

export const adminGetMessagesByRoom = async (roomId: string) => {
  const response = await api.get(`/admin/chatrooms/${roomId}/messages`);
  return response.data;
};
