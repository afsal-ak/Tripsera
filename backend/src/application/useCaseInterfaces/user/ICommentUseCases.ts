 import { CreateCommentDto, UpdateCommentDto, CommentResponseDTO, ReplyCommentDto } from '@application/dtos/CommentDTO';
 import { IPaginatedResult } from '@domain/entities/IPaginatedResult';

export interface ICommentUseCases {

    createComment(data: CreateCommentDto): Promise<CommentResponseDTO>
    replyComment(data: ReplyCommentDto): Promise<CommentResponseDTO>

    updateComment(id: string, dto: UpdateCommentDto): Promise<CommentResponseDTO | null>

    deleteComment(id: string): Promise<boolean>


    toggleLike(commentId: string, userId: string): Promise<CommentResponseDTO | null>

  
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
