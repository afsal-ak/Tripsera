import { IComment, ICommentWithReplyCount } from '@domain/entities/IComment';
import { CommentResponseDTO } from '@application/dtos/CommentDTO';
 
export class CommentMapper {
   
  static toResponseDTO(comment: IComment): CommentResponseDTO {
    return {
      _id: comment._id?.toString() ?? '',
      parentId: comment.parentId?.toString() ?? '',
      parentType: comment.parentType,
      replyUser:
        typeof comment.userId === 'object'
          ? comment.userId.toString()
          : (comment.userId as string),
      text: comment.text,
      likes: comment.likes?.map((like) => like.toString()) ?? [],
      parentCommentId: comment.parentCommentId
        ? comment.parentCommentId.toString()
        : null,
      replyCount: (comment as ICommentWithReplyCount).replyCount ?? 0,
      createdAt: comment.createdAt!,
      updatedAt: comment.updatedAt!,
    };
  }

  /**
   * Convert a comment entity with user and replyCount to CommentResponseDTO.
   * Used when user details are populated.
   */
  static toResponseWithReplyCountDTO(
    comment: ICommentWithReplyCount
  ): CommentResponseDTO {
    return {
      _id: comment._id?.toString() ?? '',
      parentId: comment.parentId?.toString() ?? '',
      parentType: comment.parentType,
      user: comment.user
        ? {
            _id: comment.user._id?.toString() ?? '',
            username: comment.user.username ?? '',
            profileImage: comment.user.profileImage?.url || null,
          }
        : undefined,
      text: comment.text,
      likes: comment.likes?.map((like) => like.toString()) ?? [],
      parentCommentId: comment.parentCommentId
        ? comment.parentCommentId.toString()
        : null,
      replyCount: comment.replyCount ?? 0,
      createdAt: comment.createdAt!,
      updatedAt: comment.updatedAt!,
    };
  }

  
  
}
