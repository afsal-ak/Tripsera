 import adminApi from "@/lib/axios/adminAxios";
import type { IFilter } from "@/types/IFilter";
import { useCleanFilter } from "@/hooks/useCleanFilter ";


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

  const response = await adminApi.get(`/reviews`, { params });
  return response.data;
};

 
export const handleReviewDetail=async(reviewId:string)=>{
    const response=await adminApi.get(`reviews/${reviewId}`)
     return response.data
}

export const handleChangeStatus=async(reviewId:string,status:boolean)=>{
      const response=await adminApi.patch(`/reviews/${reviewId}/status`,{status})
    console.log(response,'response from admin review')
    return response.data
}
 
export const handleDeleteReview=async(reviewId:string)=>{
    const response=await adminApi.delete(`reviews/${reviewId}/delete`)
    console.log(response,'response from admin review')
    return response.data
}



export const REVIEW_ROUTE = {
  GET_REVIEWS: '/reviews',
 // GET_BY_PACKAGE: '/packages/:packageId/reviews',
  CHANGE_STATUS: '/reviews/:reviewId/status',
  DELETE: '/reviews/:reviewId/delete',
};
