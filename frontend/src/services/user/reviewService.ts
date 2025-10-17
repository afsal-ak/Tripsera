import api from '@/lib/axios/api';
import type { IFilter } from "@/types/IFilter"; 

 
export const handlePackageReview = async (
  packageId: string,
  page: number,
  limit: number,
  filter: IFilter = {}
) => {
 
  const params = {
    page,
    limit,
    ...filter,
  };

  const response = await api.get(`/user/packages/${packageId}/reviews`, { params });
  return response.data.review;
};



export const handleAddReview=async(packageId:string,rating:number,title:string,comment:string)=>{
    const response=await api.post(`/user/packages/${packageId}/reviews`,{rating,title,comment})
    return response.data
}

export const handleEditReview=async(reviewId:string,rating:number,title:string,comment:string)=>{
    const response=await api.put(`/user/reviews/${reviewId}/edit`,{rating,title,comment})
    return response.data
}


export const handleUserReview=async(page:number,limit:number)=>{
    const response=await api.get(`/user/users/me/reviews?page=${page}&limit=${limit}`)
    console.log(response.data.data,'in uer review');
    
     return response.data.data
}

export const handleReviewDetail=async(reviewId:string)=>{
    const response=await api.get(`/user/reviews/${reviewId}`)
     return response.data
}
export const handleReviewRating=async(packageId:string)=>{
    const response=await api.get(`/user/reviews/summary/${packageId}`)
     return response.data
}
 
export const handleDeleteReview=async(reviewId:string)=>{
    const response=await api.delete(`/user/reviews/${reviewId}/delete`)
    console.log(response,'response from user review')
    return response.data
}

 