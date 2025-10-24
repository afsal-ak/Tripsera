import { EnumBlogStatus } from '@constants/enum/blogEnum';

export interface CreateBlogDTO {
  title: string;
  slug?: string;
  content: string;
  coverImage?: { url: string; public_id: string };
  images?: { url: string; public_id: string }[];
  tags?: string[];
  author: string; // User ID
  status: EnumBlogStatus;
}

export interface UpdateBlogDTO {
  title?: string;
  slug?: string;
  content?: string;
  coverImage?: { url: string; public_id: string };
  images?: { url: string; public_id: string }[];
  tags?: string[];
  status?: EnumBlogStatus;
  isBlocked?: boolean;
}

export interface BlogAuthorDTO {
  _id: string;
  username: string;
  email: string;
  profileImage?:string
}

export interface BlogResponseDTO {
  _id: string;
  title: string;
  slug?: string;
  content: string;
  coverImage?: { url: string; public_id: string };
  images?: { url: string; public_id: string }[];
  tags?: string[];
  author: BlogAuthorDTO;
  likes: string[];
  status: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
