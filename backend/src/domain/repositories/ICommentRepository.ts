import { IComment,IReply } from "@domain/entities/IComment";

export interface ICommentRepository {
  addComment(blogId: string, userId: string, text: string): Promise<IComment>;
  deleteComment(commentId: string, userId: string,blogId:string): Promise<void>;
  getComments(blogId: string, page: number, limit: number): Promise<IComment[]>;
  likeComment(commentId: string, userId: string): Promise<void>;
  unlikeComment(commentId: string, userId: string): Promise<void>;
  replyToComment(commentId: string, userId: string, replyText: string): Promise<IReply>;
}
