import api from '@/lib/axios/api';
import type { IBlog } from '@/types/IBlog';

export const fetchAllPublishedBlog = async (page: number, limit: number, searchBlog: string) => {
  const response = await api.get(`/user/blogs?page=${page}&limit=${limit}&search=${searchBlog}`);
  return response.data;
};

export const fetchBlogBySlug = async (slug: string) => {
  const response = await api.get(`/user/blog/slug/${slug}`);
  console.log(response, 'from servoce');
  return response.data;
};

export const fetchBlogById = async (blogId: string) => {
  const response = await api.get(`/user/blog/${blogId}`);
  console.log(response, 'from servoce');
  return response.data;
};

export const handleBlogCreation = async (formData: FormData) => {
  const response = await api.post(`/user/blog/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response, 'from servoce');
  return response.data;
};
export const handleBlogEdit = async (blogId: string, formData: FormData) => {
  const response = await api.put(`/user/blog/edit/${blogId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response, 'from servoce');
  return response.data;
};
 
export const handleDeleteBlog = async (blogId: string): Promise<IBlog> => {
  const response = await api.delete(`/user/blog/delete/${blogId}`);
  return response.data;
};

export const handleLikeBlog = async (blogId: string) => {
  const response = await api.patch(`/user/blog/like/${blogId}`);
  return response.data;
};

export const handleUnLikeBlog = async (blogId: string) => {
  const response = await api.patch(`/user/blog/unlike/${blogId}`);
  return response.data;
};

export const fetchBlogLikeList = async (blogId: string) => {
  const response = await api.get(`/user/blog/likeList/${blogId}`);
  return response.data;
};
// //
export const handleAllUserBlogs = async (page: number, limit: number) => {
  const response = await api.get(`/user/blogs/user?page=${page}&limit=${limit}`);
  return response.data;
};


export const handlePublicUserBlogs = async (userId:string,page: number, limit: number) => {
  const response = await api.get(`/user/blogs/public/${userId}?page=${page}&limit=${limit}`);
  return response.data;
};

//  BLOG_LIKE_LIST: '/blog/likeList/:blogId',
