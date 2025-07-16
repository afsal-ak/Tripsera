import adminApi from "@/lib/axios/adminAxios";


export const getAllBooking=async(page:number,limit:number)=>{
    const response=await adminApi.get(`/booking?page=${page}&limit=${limit}`)
    return response.data
}

export const getBookingById=async(id:string)=>{
    const response=await adminApi.get(`/booking/${id}`)
    return response.data
}

export const cancelBooking=async(id:string,reason:string)=>{
    const response=await adminApi.patch(`/booking/cancel/${id}`,{reason})
    return response.data
}
