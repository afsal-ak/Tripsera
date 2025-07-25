import adminApi from '@/lib/axios/adminAxios';

export const fetchBlogById = async (blogId: string) => {
  const response = await adminApi.get(`/blog/${blogId}`);
  console.log(response, 'from servoce');
  return response.data;
};
export const getAllBlogs = async (page: number, limit: number) => {
  const response = await adminApi.get(`/blogs?page=${page}&limit=${limit}`);
  return response.data;
};
export const changeBlogStatus = async (blogId: string, isBlocked: boolean) => {
  const res = await adminApi.patch(`/blog/status/${blogId}`, { isBlocked });
  return res.data;
};

// export const getAllBlogs = async (
//   page: number,
//   limit: number,
//   packageQuery?: string,
//   status?: string,
//   startDate?: string,
//   endDate?: string
// ) => {
//   const params = new URLSearchParams({
//     page: page.toString(),
//     limit: limit.toString(),
//   });

//   if (packageQuery) params.append("package", packageQuery);
//   if (status) params.append("status", status);
//   if (startDate) params.append("startDate", startDate);
//   if (endDate) params.append("endDate", endDate);

//   const response = await adminApi.get(`/blogs?${params.toString()}`);
//   return response.data;
// };
export const deleteBlogAdmin = async (blogId: string) => {
  const response = await adminApi.delete(`/blog/${blogId}`);
  return response.data;
};
