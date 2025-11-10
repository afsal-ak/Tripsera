import { EnumBlogStatus } from '@constants/enum/blogEnum';

 export interface BlogSectionDTO {
  _id?: string;

  heading: string;
  content: string;
  image?: { url: string; public_id?: string };
}

//  Comment structure for responses
export interface BlogCommentDTO {
  _id: string;
  user: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  text: string;
  createdAt: Date;
}

//  Author info used in responses
export interface BlogAuthorDTO {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

//  DTO for creating a blog
export interface CreateBlogDTO {
  title: string;
  slug?: string;
  overview?: string; // short intro shown below the title
  content: string;
  coverImage?: { url: string; public_id?: string };
  images?: { url: string; public_id?: string }[];
  sections?: BlogSectionDTO[]; // multi-part layout support
  tags?: string[];
  author: string; // user id
  status: EnumBlogStatus;
}

export interface UpdateBlogDTO {
  title?: string;
  slug?: string;
  overview?: string;
  content?: string;
  coverImage?: { url: string; public_id?: string };
  images?: { url: string; public_id?: string }[];
  sections?: BlogSectionDTO[];
  tags?: string[];
  status?: EnumBlogStatus;
  isBlocked?: boolean;
  deletedSections?: string[];  // new
  sectionImageId?: string;
  sectionImageIndexes?: string | string[]; // new for index-based mapping

  //  Newly added fields for edit 
  existingCoverImage?: any;
  existingSectionImages?: string;
  deletedImages?: string | string[];
}


export interface BlogResponseDTO {
  _id: string;
  title: string;
  slug?: string;
  overview?: string;
  content: string;
  coverImage?: { url: string; public_id?: string };
  images?: { url: string; public_id?: string }[];
  sections?: BlogSectionDTO[];
  tags?: string[];
  author: BlogAuthorDTO;
  likes: string[];
  comments?: BlogCommentDTO[];
  status: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
