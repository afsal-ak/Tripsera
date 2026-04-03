import api from '@/lib/axios/api';
import type { IFilter } from '@/types/IFilter';

export const handleFetchReview = async (page: number, limit: number, filter: IFilter) => {
  const params = {
    page,
    limit,
    ...filter,
  };

  const response = await api.get(`/company/reviews`, { params });

  return response.data.data;
};

export const handleReviewDetail = async (reviewId: string) => {
  const response = await api.get(`/company/reviews/${reviewId}`);
  return response.data;
};
