import api from "@/lib/axios/api";

export const fetchNotification=async()=>{
    const response=await api.get('/user/notification')
   // console.log(response)
    return response.data
}