export type EnumParentType = 'blog' | 'review';


export interface IComment {
  _id: string;
  parentId: string;
  parentType: EnumParentType;
  user: {
    _id: string;
    username: string;
    profileImage:string
  };
  replyUser?: {
    _id: string;
    username: string;
    profileImage:{url?:string}
  };
  text: string;
  mentions?: {
    _id: string;
    username: string;
  }[];
  likes?: string[];
  parentCommentId?: string | null;
  replyCount?:number;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateComment {
  parentId: string;
  parentType: string;
   text: string;
  mentions?: string[];
 }

 export interface ReplyComment {
  parentId: string;
  parentType: string;
   text: string;
  mentions?: string[];
  parentCommentId: string 
 }