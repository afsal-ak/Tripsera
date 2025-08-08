import userApi from '@/lib/axios/userAxios';
import type { IBlog } from '@/types/IBlog';

export const fetchAllPublishedBlog = async (page: number, limit: number, searchBlog: string) => {
  const response = await userApi.get(`/blogs?page=${page}&limit=${limit}&search=${searchBlog}`);
  return response.data;
};

export const fetchBlogBySlug = async (slug: string) => {
  const response = await userApi.get(`/blog/slug/${slug}`);
  console.log(response, 'from servoce');
  return response.data;
};

export const fetchBlogById = async (blogId: string) => {
  const response = await userApi.get(`/blog/${blogId}`);
  console.log(response, 'from servoce');
  return response.data;
};

export const handleBlogCreation = async (formData: FormData) => {
  const response = await userApi.post(`/blog/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response, 'from servoce');
  return response.data;
};
export const handleBlogEdit = async (blogId: string, formData: FormData) => {
  const response = await userApi.put(`/blog/edit/${blogId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response, 'from servoce');
  return response.data;
};
 
export const handleDeleteBlog = async (blogId: string): Promise<IBlog> => {
  const response = await userApi.delete(`/blog/delete/${blogId}`);
  return response.data;
};

export const handleLikeBlog = async (blogId: string) => {
  const response = await userApi.patch(`/blog/like/${blogId}`);
  return response.data;
};

export const handleUnLikeBlog = async (blogId: string) => {
  const response = await userApi.patch(`/blog/unlike/${blogId}`);
  return response.data;
};
// //
export const handleAllUserBlogs = async (page: number, limit: number) => {
  const response = await userApi.get(`/blogs/user?page=${page}&limit=${limit}`);
  return response.data;
};


export const handlePublicUserBlogs = async (userId:string,page: number, limit: number) => {
  const response = await userApi.get(`/blogs/public/${userId}?page=${page}&limit=${limit}`);
  return response.data;
};