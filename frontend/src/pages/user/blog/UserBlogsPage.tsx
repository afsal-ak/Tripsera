import { useState, useEffect } from 'react';
import BlogCard from '@/components/user/BlogCard';
import { handleAllUserBlogs } from '@/services/user/blogService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import type { IBlog } from '@/types/IBlog';
import { Button } from '@/components/Button';
import { Plus } from 'lucide-react'; // for icon

const UserBlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 4;

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await handleAllUserBlogs(currentPage, limit);
      setBlogs(response.data);
      setTotalPages(response.totalBlogs);
    };
    fetchBlogs();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Your Blogs</h1>
         </div>

        <Button
          onClick={() => navigate(`/account/my-blogs/add`)}
          className="flex items-center gap-2 mt-4 sm:mt-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-md hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200"
        >
          <Plus size={18} /> Add Blog
        </Button>
      </div>

      {/* Blog Grid */}
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} linkPrefix="/account/my-blogs" />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-lg">No blogs found. Start sharing your thoughts!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {paginationButtons}
        </div>
      )}
    </section>
  );
};

export default UserBlogsPage;
