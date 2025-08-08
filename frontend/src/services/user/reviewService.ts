import userApi from "@/lib/axios/userAxios";
 
export const handlePackageReview=async(packageId:string,page:number,limit:number)=>{
    const response=await userApi.get(`/packages/${packageId}/reviews?page=${page}&limit=${limit}`,)
    return response.data
}

export const handleAddReview=async(packageId:string,rating:number,title:string,comment:string)=>{
    const response=await userApi.post(`/packages/${packageId}/reviews`,{rating,title,comment})
    return response.data
}

export const handleEditReview=async(reviewId:string,rating:number,title:string,comment:string)=>{
    const response=await userApi.put(`/reviews/${reviewId}/edit`,{rating,title,comment})
    return response.data
}


export const handleUserReview=async(page:number,limit:number)=>{
    const response=await userApi.get(`/users/me/reviews?page=${page}&limit=${limit}`)
     return response.data
}

export const handleReviewDetail=async(reviewId:string)=>{
    const response=await userApi.get(`reviews/${reviewId}`)
     return response.data
}
export const handleReviewRating=async(packageId:string)=>{
    const response=await userApi.get(`reviews/summary/${packageId}`)
     return response.data
}
 
export const handleDeleteReview=async(reviewId:string)=>{
    const response=await userApi.delete(`reviews/${reviewId}/delete`)
    console.log(response,'response from user review')
    return response.data
}

 