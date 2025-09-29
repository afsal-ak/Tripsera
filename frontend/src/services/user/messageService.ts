import api from "@/lib/axios/api";
import type{ IChatRoomFilter } from "@/types/IChatRoom";
 
interface CreateChatRoomPayload {
  participants: string[];
  name?: string;
  isGroup: boolean;
}

export const createChatRoom = async (payload: CreateChatRoomPayload) => {
 
    const response = await api.post("/user/chatrooms", payload);
    return response.data;

};
// export const createUserRoom=async()=>{
//     const response=await api.post(`/user/chatrooms`)
//     return response.data
// }

export const updateUserRoom=async(roomId:string)=>{
    const response=await api.post(`/user/chatrooms/${roomId}`)
    return response.data
}


export const deleteUserRoom=async(roomId:string)=>{
    const response=await api.delete(`/user/chatrooms/${roomId}`)
    return response.data
}

export const getChatRoomById=async(roomId:string)=>{
    const response=await api.get(`/user/chatrooms/${roomId}`)
    return response.data
}

// export const getUserRoom=async()=>{
//     const response=await api.get(`/user/chatrooms`)
//     console.log(response,'respo')
//     return response.data
// }

export const getUserRoom = async (filters?: IChatRoomFilter) => {
  const response = await api.get(`/user/chatrooms`, {
    params: filters, 
  });
  return response.data;
};
export const getMessagesByRoom=async(roomId:string)=>{
    const response=await api.get(`/user/chatrooms/${roomId}/messages`)
    return response.data
}


export const uploadFile = async (formData: FormData) => {
  const response = await api.post('/admin/messages/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response,'response chat')
  return response.data;
};

export const CHAT_ROOM_ROUTE = {
  CREATE: "/chatrooms",                           // POST → Create a chat room
  UPDATE: "/chatrooms/:roomId",                   // PUT/PATCH → Update chat room details
  GET_BY_ID: "/chatrooms/:roomId",                // GET → Get specific chat room by ID
  GET_USER_ROOMS: "/chatrooms",      // GET → Get all chat rooms for a user
  DELETE: "/chatrooms/:roomId",                   // DELETE → Delete a chat room
};


export const MESSAGE_ROUTE = {
  SEND: "/chatrooms/messages",                // POST → Send message to a chat room
  GET_BY_ROOM: "/chatrooms/:roomId/messages",         // GET → Fetch all messages in a room
  MARK_AS_READ: "/messages/:messageId/read",          // PATCH → Mark a specific message as read
  DELETE: "/messages/:messageId",                     // DELETE → Delete a specific message
};
