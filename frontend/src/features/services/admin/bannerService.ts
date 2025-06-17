import adminApi from "@/lib/axios/adminAxios";

export const fetchBannerData=async(page=1,limit=10)=>{
    const response=await adminApi.get(`/banners?page=${page}&limit=${limit}`)
    return response.data
    
}
// src/features/services/admin/bannerService.ts

 
export const addBanner = async (formData: FormData) => {
  const response = await adminApi.post("/addBanner", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const blockBanner=async(id:string)=>{
      try {
    const response =await adminApi.patch(`/banners/${id}/block`)
        
        return response.data

    } catch (error) {
     console.error("Failed to block banner", error);

    }
}
export const unBlockBanner=async(id:string)=>{
      try {
    const response =await adminApi.patch(`/banners/${id}/unblock`)
        
        return response.data

    } catch (error) {
     console.error("Failed to unblock banner", error);

    }
}

export const deleteBanner=async(id:string)=>{
    try {
        const response =await adminApi.delete(`/banners/${id}/delete`)
        
        return response.data

    } catch (error) {
   console.error("Failed to delete banner", error);

    }
}