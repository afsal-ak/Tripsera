import { Types } from 'mongoose';
import { EnumParentType } from '@constants/enum/commentEnum';

export interface IComment {
  _id?: string;
  parentId: Types.ObjectId | string;
  parentType: EnumParentType;
  userId: Types.ObjectId | string;
  text: string;
  mentions?: (Types.ObjectId | string)[];
  likes?: (Types.ObjectId | string)[];
  parentCommentId?: Types.ObjectId | string | null; // for replies
  replyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommentWithReplyCount extends IComment {
  user?: {
    _id: string;
    username: string;
    profileImage: { url: string };
  };

  replyCount?: number; // derived, not persisted
}
