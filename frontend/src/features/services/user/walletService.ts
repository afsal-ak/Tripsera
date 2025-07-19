import userApi from "@/lib/axios/userAxios";

export const getWallet=async(page:number,limit:number,sort:string)=>{
    const response=await userApi.get(`/wallet?page=${page}&limit=${limit}&sort=${sort}`)
    return response.data
}


export const getWalletBalance=async()=>{
    const response=await userApi.get('/wallet-balance')
    return response.data
}

