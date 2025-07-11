import userApi from "@/lib/axios/userAxios";

export const getAllWishlist = async (page: number, limit: number) => {
    const response = await userApi.get(`/wishlist?page=${page}&limit=${limit}`)
    return response.data
}

export const addToWishlist = async (packageId: string) => {
    const response = await userApi.post('/wishlist/add', { packageId })
    return response.data
}

export const checkPackageInWishlist=async(packageId:string)=>{
    const response=await userApi.get(`/wishlist/check?packageId=${packageId}`)
     return response.data
}

export const deleteFromWishlist = async (packageId: string) => {
    const response = await userApi.delete("/wishlist/delete", {
        data: { packageId },
    });
    return response.data
}