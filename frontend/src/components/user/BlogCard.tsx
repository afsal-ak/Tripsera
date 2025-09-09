import type { IBlog } from '@/types/IBlog';
import { Link } from 'react-router-dom';

type Props = {
  blog: IBlog;
  linkPrefix?: string;
};

const BlogCard = ({ blog, linkPrefix }: Props) => {
  const image = blog.images![0]?.url.replace('/upload/', '/upload/f_auto,q_auto/') || '';
  const blogUrl = `${linkPrefix}/${blog.slug}`;

  return (
    <Link to={blogUrl} className="group block h-full">
      <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 relative h-full flex flex-col">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={blog.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight min-h-[3.5rem]">
            {blog.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed flex-grow min-h-[4.5rem]">
            {blog.content}
          </p>
          
          {/* Author and Date Row */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-3">
              {blog.author.profileImage?.url ? (
                <img
                  src={blog.author.profileImage?.url}
                  alt={blog.author.username}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-colors flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {blog.author.username}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-800 truncate">{blog.author.username}</div>
                <div className="text-xs text-gray-500">
                  {new Date(blog.createdAt!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            {/* Read More Arrow */}
            <div className="text-blue-500 group-hover:text-blue-600 transition-colors flex-shrink-0">
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hover Effect Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </article>
    </Link>
  );
};

export default BlogCard;