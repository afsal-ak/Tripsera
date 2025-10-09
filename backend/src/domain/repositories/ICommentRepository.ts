import { IComment } from '@domain/entities/IComment';
import { IBaseRepository } from './IBaseRepository';
import { PaginationInfo } from '@application/dtos/PaginationDto';

export interface ICommentRepository extends IBaseRepository<IComment> {
  
  replyToComment(commentId: string, reply: { user: string; text: string }): Promise<IComment | null>;
  toggleLike(commentId: string, userId: string): Promise<IComment | null>;
  getCommentsByParentId(
    parentId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: IComment[]; pagination: PaginationInfo }>;

  getRepliesByCommentId(
    commentId: string,
    page?: number,
    limit?: number
  ): Promise<{ data: IComment[]; pagination: PaginationInfo }>;
}
