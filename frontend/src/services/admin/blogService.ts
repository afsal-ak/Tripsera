 import api from '@/lib/axios/api';
 import type { IFilter } from '@/types/IFilter';
export const fetchBlogById = async (blogId: string) => {
  const response = await api.get(`/admin/blog/${blogId}`);
  console.log(response, 'from servoce');
  return response.data;
};
export const getAllBlogs = async (page: number, limit: number,filter:IFilter) => {
     const params={
        page,
        limit,
        ...filter
    }
  const response = await api.get(`/admin/blogs`,{params});
  return response.data.data;
};
export const changeBlogStatus = async (blogId: string, isBlocked: boolean) => {
  const res = await api.patch(`/admin/blog/status/${blogId}`, { isBlocked });
  return res.data;
};


export const deleteBlogAdmin = async (blogId: string) => {
  const response = await api.delete(`/admin/blog/${blogId}`);
  return response.data;
};
