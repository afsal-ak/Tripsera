import { IBlog } from '@domain/entities/IBlog';
import { BlogResponseDTO } from '@application/dtos/BlogDTO';

export class BlogMapper {
  static toResponseDTO(blog: IBlog & { author?: any }): BlogResponseDTO {
    const author = blog.author || {};

    return {
      _id: blog._id?.toString() ?? '',
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      coverImage: blog.coverImage,
      images: blog.images || [],
      tags: blog.tags || [],
      author: {
        _id: author._id?.toString?.() || author.toString?.() || '',
        username: author.username || 'Unknown',
        email: author.email || '',
      },
      likes: blog.likes?.map((id) => id.toString()) ?? [],
      status: blog.status,
      isBlocked: blog.isBlocked ?? false,
      createdAt: blog.createdAt!,
      updatedAt: blog.updatedAt!,
    };
  }
}
