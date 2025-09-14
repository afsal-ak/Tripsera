import api from "@/lib/axios/api";


interface CreateChatRoomPayload {
  participants: string[];
  name?: string;
  isGroup: boolean;
}

export const adminCreateChatRoom = async (payload: CreateChatRoomPayload) => {
 
    const response = await api.post("/admin/chatrooms", payload);
    return response.data;

};
// export const updateUserRoom=async(roomId:string)=>{
//     const response=await api.post(`/admin/chatrooms/${roomId}`)
//     return response.data
// }


export const adminDeleteUserRoom=async(roomId:string)=>{
    const response=await api.delete(`/admin/chatrooms/${roomId}`)
    return response.data
}

export const adminGetChatRoomById=async(roomId:string)=>{
    const response=await api.get(`/admin/chatrooms/${roomId}`)
    return response.data
}


export const adminGetUserRoom=async()=>{
    const response=await api.get(`/admin/chatrooms`)
    console.log(response,'respo')
    return response.data
}

export const adminGetMessagesByRoom=async(roomId:string)=>{
    const response=await api.get(`/admin/chatrooms/${roomId}/messages`)
    return response.data
}


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
