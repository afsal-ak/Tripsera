// import { IBlog } from "@domain/entities/IBlog";
 
// export interface CreateBlogDTO {
//   title: string;
//   slug?: string;
//   content: string;
//   coverImage?: {
//     url: string;
//     public_id: string;
//   };
//   images?: { url: string; public_id: string }[];
//   tags?: string[];
//   author: string;  
//   status: "draft" | "published" | "archived";
// }

// export interface UpdateBlogDTO {
//   title?: string;
//   slug?: string;
//   content?: string;
//   coverImage?: {
//     url: string;
//     public_id: string;
//   };
//   images?: { url: string; public_id: string }[];
//   tags?: string[];
//   status?: "draft" | "published" | "archived";
//   isBlocked?: boolean;
// }

// export interface BlogAuthorDTO {
//   _id: string;
//   username: string;
//   email: string;
// }

// export interface BlogResponseDTO {
//   _id: string;
//   title: string;
//   slug?: string;
//   content: string;
//   coverImage?: {
//     url: string;
//     public_id: string;
//   };
//   images?: { url: string; public_id: string }[];
//   tags?: string[];
//   author: BlogAuthorDTO;
//   likes: string[];
//   status: "draft" | "published" | "archived";
//   isBlocked: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const toBlogResponseDTO = (blog: IBlog & { author: any }): BlogResponseDTO => {
//   return {
//     _id: blog._id!.toString(),
//     title: blog.title,
//     slug: blog.slug,
//     content: blog.content,
//     coverImage: blog.coverImage,
//     images: blog.images || [],
//     tags: blog.tags || [],
//     author: {
//       _id: blog.author._id?.toString() || blog.author.toString(),
//       username: blog.author.username || "Unknown",
//       email: blog.author.email || "",
//     },
//     likes: blog.likes ? blog.likes.map((id) => id.toString()) : [],
//     status: blog.status,
//     isBlocked: blog.isBlocked ?? false,
//     createdAt: blog.createdAt!,
//     updatedAt: blog.updatedAt!,
//   };
// };

import { EnumBlogStatus } from "@constants/enum/blogEnum";

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
