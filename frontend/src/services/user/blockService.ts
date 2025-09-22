import api from "@/lib/axios/api";


export const handleBlockUser = async (blockedId: string, reason?: string) => {
  const response = await api.post("/user/block", { blockedId, reason });
  return response.data;
};

export const handelUnBlockUser=async(blockedId:string)=>{
    const response=await api.put('/user/unblock',{blockedId})
    return response.data
}

export const handelFetchBlockedUser=async()=>{
    const response=await api.get('/user/blocked')
    return response.data
}
export const handelIsBlocked=async(blockedId:string)=>{
  console.log(blockedId,'id from seeeeee')
    const response=await api.get(`/user/blocked/${blockedId}`)
    return response.data
}


export const BLOCK_ROUTE={
  BLOCK:'/block',
  UNBLOCK:'/unblock',
  IS_BLOCKED:'/blocked/:blockedId',
  GELL_ALL:'blocked'
}