import userApi from "@/lib/axios/userAxios";

export const getWallet=async(page:number,limit:number,sort:string)=>{
    const response=await userApi.get(`/wallet?page=${page}&limit=${limit}&sort=${sort}`)
    return response.data
}