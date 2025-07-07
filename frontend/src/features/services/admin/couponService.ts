import adminApi from "@/lib/axios/adminAxios";
import type { CouponFormSchema } from "@/features/schemas/CouponFormSchema";
export const fetchCouponData=async(page:number,limit:number)=>{
    const response=await adminApi.get(`/coupons?page=${page}&limit=${limit}`)
    console.log(response.data,'coupons')
     return response.data;
}

export const createCoupon=async(couponData:CouponFormSchema)=>{
    const response=await adminApi.post('/coupon/add',couponData)
    return response.data
}

export const getCouponById=async(id:string)=>{
    const response=await adminApi.get(`/coupon/${id}`)
    return response.data
}

export const editCoupon=async(id:string,couponData:Partial<CouponFormSchema>)=>{
     const response=await adminApi.put(`/coupon/edit/${id}`,couponData)
    return response.data
}

export const changeCouponStatus=async(id:string,body: { isActive: boolean })=>{
    const response=await adminApi.patch(`/coupon/status/${id}`,body)
    return response.data

}