import api from "@/lib/axios/api";

// export const fetchUserNotification=async()=>{
//     const response=await api.get('/user/notification')
//    // console.log(response)
//     return response.data
// }

export const fetchUserNotification = async (params?: { page?: number; limit?: number; status?: string }) => {
  const response = await api.get("/user/notification", { params });
  return response.data;
};


export const markNotificationAsRead = async (id:string) => {
  const response = await api.patch(`/user/mark-read/${id}`);
  return response.data;
};
