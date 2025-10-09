import { ICommentRepository } from '@domain/repositories/ICommentRepository';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDTO, ReplyCommentDto } from '@application/dtos/CommentDTO';
import { IComment } from '@domain/entities/IComment';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';

export interface ICommentUseCases {

    createComment(data: CreateCommentDto): Promise<CommentResponseDTO>
    replyComment(data: ReplyCommentDto): Promise<CommentResponseDTO>

    updateComment(id: string, dto: UpdateCommentDto): Promise<IComment | null>

    deleteComment(id: string): Promise<boolean>


    toggleLike(commentId: string, userId: string): Promise<IComment | null>

  
    getReplies(
        commentId: string,
        page: number,
        limit: number,
    ): Promise<IPaginatedResult<CommentResponseDTO>>  
    
      getComments(
        parentId: string,
        page: number,
        limit: number,
    ): Promise<IPaginatedResult<CommentResponseDTO>>  
    
}
