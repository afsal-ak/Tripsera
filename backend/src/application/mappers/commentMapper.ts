
import { IComment, ICommentWithReplyCount } from '@domain/entities/IComment';
import { CommentResponseDTO } from '@application/dtos/CommentDTO';
import { Types } from 'mongoose';


export const toCommentResponseDTO = (comment: IComment): CommentResponseDTO => ({
  _id: comment._id?.toString() ?? '',
  parentId: comment.parentId?.toString() ?? '',
  parentType: comment.parentType,
replyUser:comment.userId as string,
  text: comment.text,


  mentions: (comment as any).mentions?.map((m: any) => ({
    _id: m?._id?.toString?.() ?? m?.toString?.(),
    username: (m as any).username ?? '',
  })) ?? [],
  likes: comment.likes?.map((like: Types.ObjectId | string) => like.toString()) ?? [],
  parentCommentId: comment.parentCommentId ? comment.parentCommentId.toString() : null,
  replyCount: (comment as ICommentWithReplyCount).replyCount ?? 0,
  createdAt: comment.createdAt!,
  updatedAt: comment.updatedAt!,
});


export const toCommentResponseWithReplyCountDTO = (comment: ICommentWithReplyCount): CommentResponseDTO => ({
  _id: comment._id?.toString() ?? '',
  parentId: comment.parentId?.toString() ?? '',
  parentType: comment.parentType,
   user: {
    _id: comment?.user?._id!.toString()!,
    username: comment.user?.username!,
  profileImage: comment.user?.profileImage?.url || null,
  },
  text: comment.text,


  mentions: (comment as any).mentions?.map((m: any) => ({
    _id: m?._id?.toString?.() ?? m?.toString?.(),
    username: (m as any).username ?? '',
  })) ?? [],
  likes: comment.likes?.map((like: Types.ObjectId | string) => like.toString()) ?? [],
  parentCommentId: comment.parentCommentId ? comment.parentCommentId.toString() : null,
  replyCount: (comment as ICommentWithReplyCount).replyCount ?? 0,
  createdAt: comment.createdAt!,
  updatedAt: comment.updatedAt!,
});

// export const txoCommentResponseDTO = (
//   comment: IComment
// ): CommentResponseDTO => {
   
//   return {
//     _id: comment._id?.toString() ?? "",
//     parentId: comment.parentId?.toString() ?? "",
//     parentType: comment.parentType,
//     user:comment.userId as string,
//     text: comment.text,
    
//     likes: comment.likes?.map((like: Types.ObjectId | string) => like.toString()) ?? [],
//     parentCommentId: comment.parentCommentId
//       ? comment.parentCommentId.toString()
//       : null,
//     replyCount: comment.replyCount ?? 0,
//     createdAt: comment.createdAt!,
//     updatedAt: comment.updatedAt!,
//   };
// };