import api from '@/lib/axios/api';
import type { IFilter } from "@/types/IFilter";


export const handleFetchReview = async (
  page: number,
  limit: number,
  filter: IFilter
) => {
  const params = {
    page,
    limit,
    ...filter,
  };

  const response = await api.get(`/admin/reviews`, { params });
   
  return response.data.data;
};

 
export const handleReviewDetail=async(reviewId:string)=>{
    const response=await api.get(`/admin/reviews/${reviewId}`)
     return response.data
}

export const handleChangeStatus=async(reviewId:string,status:boolean)=>{
      const response=await api.patch(`/admin/reviews/${reviewId}/status`,{status})
    console.log(response,'response from admin review')
    return response.data
}
 
export const handleDeleteReview=async(reviewId:string)=>{
    const response=await api.delete(`/admin/reviews/${reviewId}/delete`)
    console.log(response,'response from admin review')
    return response.data
}



export const REVIEW_ROUTE = {
  GET_REVIEWS: '/reviews',
 // GET_BY_PACKAGE: '/packages/:packageId/reviews',
  CHANGE_STATUS: '/reviews/:reviewId/status',
  DELETE: '/reviews/:reviewId/delete',
};
