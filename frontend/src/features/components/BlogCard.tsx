import type { IBlog } from '../types/IBlog';
import { Link } from 'react-router-dom';

type Props = {
  blog: IBlog;
  linkPrefix?: string;
};
const BlogCard = ({ blog, linkPrefix }: Props) => {
  const image = blog.images![0]?.url.replace('/upload/', '/upload/f_auto,q_auto/') || '';
  const blogUrl = `${linkPrefix}/${blog.slug}`;

  return (
    <Link to={blogUrl} className="group">
      <div className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition">
        <img
          src={image}
          alt={blog.title}
          className="w-full h-52 object-cover group-hover:scale-105 transition"
        />
        <div className="p-4">
          <div className="flex gap-2 flex-wrap mb-2">
            {blog.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">{blog.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{blog.content}</p>
          <div className="flex items-center mt-4">
            {blog.author.profileImage?.url ? (
              <img
                src={blog.author.profileImage?.url}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
            )}
            <div className="ml-2 text-sm text-gray-700">{blog.author.username}</div>
            <div className="ml-auto text-xs text-gray-400">
              {new Date(blog.createdAt!).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
