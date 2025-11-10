import { IBlogRepository } from '@domain/repositories/IBlogRepository';
 import { IBlogUseCases } from '@application/useCaseInterfaces/user/IBlogUseCases';
import { UserBasicInfoDto } from '@application/dtos/UserBasicInfoDTO';
import { BlogResponseDTO, CreateBlogDTO, UpdateBlogDTO } from '@application/dtos/BlogDTO';
import { BlogMapper } from '@application/mappers/BlogMapper';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';
import { uploadCloudinary, deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';


export class BlogUseCases implements IBlogUseCases {
  constructor(private readonly blogRepo: IBlogRepository) { }

  async createBlog(userId: string, blogData: CreateBlogDTO): Promise<BlogResponseDTO> {
    const result = await this.blogRepo.createBlog(userId, blogData);
    return BlogMapper.toResponseDTO(result);
  }


  async editBlog(blogId: string, blogData: UpdateBlogDTO, files?: { [fieldname: string]: Express.Multer.File[]; }

  ): Promise<BlogResponseDTO | null> {


    // 1️Get existing blog
    const blog = await this.blogRepo.getBlogById(blogId);
    if (!blog) throw new AppError(HttpStatus.NOT_FOUND, 'Blog not found');

    const existingSections = blog.sections || [];

    //  Handle cover image
    let updatedCoverImage = blog.coverImage;
    if (files?.coverImage?.[0]) {
      if (blog.coverImage?.public_id) {
        await deleteImageFromCloudinary(blog.coverImage.public_id);
      }
      updatedCoverImage = await uploadCloudinary(files.coverImage[0].path, 'blogs');
    }

    //  Parse and validate section image indexes
    const sectionImageIndexes = Array.isArray(blogData.sectionImageIndexes)
      ? blogData.sectionImageIndexes.map((i) => parseInt(i))
      : blogData.sectionImageIndexes
        ? [parseInt(blogData.sectionImageIndexes)]
        : [];

    // Update sections (handle image uploads or keep existing)
    const updatedSections = await Promise.all(
      (blogData.sections || []).map(async (section, index) => {
        const existingSection = existingSections.find(
          (s) => s._id?.toString() === section._id
        );
        const hasNewImage = sectionImageIndexes.includes(index);

        if (hasNewImage && files?.sectionImages?.length) {
          const file = files.sectionImages.shift(); // take first new image

          // Delete old image if exists
          if (existingSection?.image?.public_id) {
            await deleteImageFromCloudinary(existingSection.image.public_id);
          }

          // Upload new image
          const uploadedImage = await uploadCloudinary(file!.path, 'blogs');
          return { ...section, image: uploadedImage };
        }

        // Keep old image if no new upload
        return { ...section, image: existingSection?.image || section.image };
      })
    );

    //  Handle deleted sections
    if (blogData.deletedSections?.length) {
      const toDelete = Array.isArray(blogData.deletedSections)
        ? blogData.deletedSections
        : [blogData.deletedSections];

      for (const id of toDelete) {
        const section = existingSections.find((s) => s._id?.toString() === id);
        if (section?.image?.public_id) {
          await deleteImageFromCloudinary(section.image.public_id);
        }
      }

      // Remove deleted ones from updatedSections
      for (const id of toDelete) {
        const index = updatedSections.findIndex((s) => s._id?.toString() === id);
        if (index !== -1) updatedSections.splice(index, 1);
      }
    }

    const updatedBlog = await this.blogRepo.editBlog(blogId, {
      ...blogData,
      coverImage: updatedCoverImage,
      sections: updatedSections,
    });

    return BlogMapper.toResponseDTO(updatedBlog!);
  }


  async getBlogById(blogId: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.getBlogById(blogId);
    return BlogMapper.toResponseDTO(result!);
  }

  async getBlogByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<BlogResponseDTO>> {
    const result = await this.blogRepo.getBlogByUser(userId, page, limit);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }

  async getAllPublishedBlogs(
    page: number,
    limit: number,
    filters?: { search?: string; tags?: string[]; startDate?: string; endDate?: string }
  ) {
    const result = await this.blogRepo.getAllPublishedBlogs(page, limit, filters);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }

  async getBySlug(slug: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.getBySlug(slug);
    return BlogMapper.toResponseDTO(result!);
  }

  async likeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.likeBlog(blogId, userId);
    return BlogMapper.toResponseDTO(result!);
  }

  async getBlogLikeList(blogId: string): Promise<UserBasicInfoDto[] | null> {
    return await this.blogRepo.getLikedList(blogId);
  }

  async unLikeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null> {
    const result = await this.blogRepo.unLikeBlog(blogId, userId);
    return BlogMapper.toResponseDTO(result!);
  }

  async blockBlog(blogId: string, block: boolean): Promise<void> {
    return await this.blogRepo.blockBlog(blogId, block);
  }

  async deleteBlog(blogId: string): Promise<void> {
    return await this.blogRepo.deleteBlog(blogId);
  }

  async changeBlogStatus(blogId: string, isActive: boolean): Promise<void> {
    return await this.blogRepo.changeBlogStatus(blogId, isActive);
  }

  async getPublicBlogsByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<BlogResponseDTO>> {
    const result = await this.blogRepo.getPublicBlogsByUser(userId, page, limit);
    return {
      pagination: result.pagination,
      data: result.blogs.map(BlogMapper.toResponseDTO),
    };
  }
}


// import { IBlogRepository } from '@domain/repositories/IBlogRepository';
// import { IBlog } from '@domain/entities/IBlog';
// import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
// import { IBlogUseCases } from '@application/useCaseInterfaces/user/IBlogUseCases';
// import { UserBasicInfoDto } from '@application/dtos/UserBasicInfoDTO';
// import { BlogResponseDTO } from '@application/dtos/BlogDTO';
// import { BlogMapper } from '@application/mappers/BlogMapper';
// import { PaginatedResult } from '@domain/entities/IPaginatedResult';
// export class BlogUseCases implements IBlogUseCases {
//   constructor(private readonly blogRepo: IBlogRepository) {}

//   async createBlog(userId: string, blogData: IBlog): Promise<BlogResponseDTO> {
//     const result = await this.blogRepo.createBlog(userId, blogData);
//     return BlogMapper.toResponseDTO(result);
//   }

//   async editBlog(
//     blogId: string,
//     blogData: Partial<IBlog>,
//     existingImages: { public_id: string }[],
//     newImages: { url: string; public_id: string }[]
//   ): Promise<BlogResponseDTO | null> {
//     const blog = await this.blogRepo.getBlogById(blogId);
//     if (!blog) throw new Error('Blog not found');

//     const deletedImages = (blog.images || []).filter(
//       (oldImg) => !existingImages.some((img) => img.public_id === oldImg.public_id)
//     );

//     for (const img of deletedImages) {
//       await deleteImageFromCloudinary(img.public_id);
//     }

//     const result = await this.blogRepo.editBlog(blogId, blogData, deletedImages, newImages);
//     return BlogMapper.toResponseDTO(result!);
//   }

//   async getBlogById(blogId: string): Promise<BlogResponseDTO | null> {
//     const result = await this.blogRepo.getBlogById(blogId);
//     return BlogMapper.toResponseDTO(result!);
//   }

//   async getBlogByUser(
//     userId: string,
//     page: number,
//     limit: number
//   ): Promise<PaginatedResult<BlogResponseDTO>> {
//     const result = await this.blogRepo.getBlogByUser(userId, page, limit);
//     return {
//       pagination: result.pagination,
//       data: result.blogs.map(BlogMapper.toResponseDTO),
//     };
//   }

//   async getAllPublishedBlogs(
//     page: number,
//     limit: number,
//     filters?: { search?: string; tags?: string[]; startDate?: string; endDate?: string }
//   ) {
//     const result = await this.blogRepo.getAllPublishedBlogs(page, limit, filters);
//     return {
//       pagination: result.pagination,
//       data: result.blogs.map(BlogMapper.toResponseDTO),
//     };
//   }

//   async getBySlug(slug: string): Promise<BlogResponseDTO | null> {
//     const result = await this.blogRepo.getBySlug(slug);
//     return BlogMapper.toResponseDTO(result!);
//   }

//   async likeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null> {
//     const result = await this.blogRepo.likeBlog(blogId, userId);
//     return BlogMapper.toResponseDTO(result!);
//   }

//   async getBlogLikeList(blogId: string): Promise<UserBasicInfoDto[] | null> {
//     return await this.blogRepo.getLikedList(blogId);
//   }

//   async unLikeBlog(blogId: string, userId: string): Promise<BlogResponseDTO | null> {
//     const result = await this.blogRepo.unLikeBlog(blogId, userId);
//     return BlogMapper.toResponseDTO(result!);
//   }

//   async blockBlog(blogId: string, block: boolean): Promise<void> {
//     return await this.blogRepo.blockBlog(blogId, block);
//   }

//   async deleteBlog(blogId: string): Promise<void> {
//     return await this.blogRepo.deleteBlog(blogId);
//   }

//   async changeBlogStatus(blogId: string, isActive: boolean): Promise<void> {
//     return await this.blogRepo.changeBlogStatus(blogId, isActive);
//   }

//   async getPublicBlogsByUser(
//     userId: string,
//     page: number,
//     limit: number
//   ): Promise<PaginatedResult<BlogResponseDTO>> {
//     const result = await this.blogRepo.getPublicBlogsByUser(userId, page, limit);
//     return {
//       pagination: result.pagination,
//       data: result.blogs.map(BlogMapper.toResponseDTO),
//     };
//   }
// }
