import api from "@/lib/axios/api";

export const fetchComments = async (parentId: string, page:number, limit:number) => {
  const res = await api.get(`/user/comment/${parentId}?page=${page}&limit=${limit}`);
    console.log(res,'from service')

  return res.data.data;
};

export const fetchReplies = async (commentId: string, page:number,limit:number) => {
  const res = await api.get(`/user/comment/${commentId}/replies?page=${page}&limit=${limit}`);
    console.log(res,'from service')

  return res.data.data;
};
  // GET_REPLIES: '/comment/:commentId/replies', // GET → get replies for a specific comment

export const addComment = async (data: { parentId: string; parentType: string; text: string }) => {
  const res = await api.post('/user/comment', data);
  return res.data;
};

export const addReply = async ( data: { parentId: string; parentCommentId: string;parentType: string; text: string }) => {
  const res = await api.post(`/user/comment/reply`, data);
  return res.data;
};



export const deleteComment = async (commentId:string) => {
  const res = await api.delete(`/user/comment/delete/${commentId}`, );
  return res.data;
};
