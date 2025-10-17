import { EnumParentType } from '@constants/enum/commentEnum';

export interface CreateCommentDto {
  parentId: string;
  parentType: EnumParentType;
  userId: string;
  text: string;
  mentions?: string[];
 }

 export interface ReplyCommentDto {
  parentId: string;
  parentType: EnumParentType;
  userId: string;
  text: string;
  mentions?: string[];
  parentComment?: string 
 }


export interface UpdateCommentDto {
  text?: string;
  mentions?: string[];
}

export interface CommentResponseDTO {
  _id: string;
  parentId: string;
  parentType: EnumParentType;
  user?: {
    _id: string;
    username: string;
    profileImage?: string|null;
  };
   replyUser?:string;
  replyCount?:number;
   text: string;
  likes?: string[];
  parentCommentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}