import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import type { IBlog } from '@/types/IBlog';

type Props = {
  blog: IBlog;
  linkPrefix?: string;
};

const BlogCard = ({ blog, linkPrefix }: Props) => {
  const blogUrl = `${linkPrefix}/${blog.slug}`;
  const image =
    blog.coverImage
      ? blog.coverImage.url.replace('/upload/', '/upload/f_auto,q_auto/')
      : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop';

  const formatDate = (date?: Date) => {
    if (!date) return 'Recent';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getExcerpt = (content: string, maxLength = 120) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const primaryTag = blog.tags?.[0] || 'Travel';

  return (
    <Link to={blogUrl} className="group block h-full">
      <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 relative h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop';
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tag Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {primaryTag}
            </span>
          </div>

          {/* Status Badge */}
          {blog.status !== 'published' && (
            <div className="absolute top-4 right-4">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                {blog.status}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Meta Info */}
          <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <span>•</span>
            <span>{getReadTime(blog.content)}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed flex-grow">
            {getExcerpt(blog.content)}
          </p>

          {/* Author + Read More */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
 

            {/* Read More Button */}
            <div className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group/btn">
              Read More
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </div>

         
        </div>

        {/* Hover Border Animation */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </article>
    </Link>
  );
};

export default BlogCard;
