import { useState, useEffect } from 'react';
import BlogCard from '@/components/user/BlogCard';
import { handleAllUserBlogs } from '@/services/user/blogService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import type { IBlog } from '@/types/IBlog';
import { Button } from '@/components/Button';
const UserBlogsPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 4;
  useEffect(() => {
    const fetchBlogs = async () => {
      console.log(currentPage, limit, 'user blog');
      const response = await handleAllUserBlogs(currentPage, limit);
      setBlogs(response.blogs);
      //console.log(response.totalBlogs)

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
    <div>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Blogs</h1>
        <Button
          className="px-4 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => navigate(`/account/my-blogs/add`)}
        >
          Add Blog
        </Button>
        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} linkPrefix="/account/my-blogs" />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">{paginationButtons}</div>
      </section>
    </div>
  );
};

export default UserBlogsPage;
