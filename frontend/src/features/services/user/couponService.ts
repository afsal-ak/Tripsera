import userApi from "@/lib/axios/userAxios";

export const getAllActiveCoupon=async(page:number,limit:number)=>{
    const response=await userApi.get(`/coupons?page=${page}&limit=${limit}`)
    return response.data
}