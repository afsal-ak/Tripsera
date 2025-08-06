import { useEffect, useState } from 'react';
import BlogCard from '@/features/components/BlogCard';
import type { IBlog } from '@/features/types/IBlog';
import { fetchAllPublishedBlog } from '@/features/services/user/blogService';
import { useSearchParams } from 'react-router-dom';
import { usePaginationButtons } from '@/features/hooks/usePaginationButtons';
const BlogsPage = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchBlog, setSearchBlog] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;

  const search = searchParams.get('search') || '';
  const handleSearch = () => {
    const input = document.getElementById('searchInput') as HTMLInputElement;
    setSearchParams({ search: input.value, page: '1', limit: limit.toString() });
  };

  const handleClearSearch = () => {
    setSearchParams({ page: '1', limit: limit.toString() });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newSearch = e.target.value;
  //   setSearchParams({ page: "1", search: newSearch, limit: limit.toString() });
  // };

  // const handleSearchClear=(e:React.ChangeEvent<HTMLInputElement>)=>{
  //           setSearchParams({ page: "1", limit: limit.toString() });
  // }
  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetchAllPublishedBlog(currentPage, limit, search);
      setBlogs(response.blogs);
      console.log(response);

      setTotalPages(Math.ceil(response.totalBlogs / limit));
    };
    fetchBlogs();
  }, [searchParams]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Blogs</h1>

      {/* Search bar with button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search blogs..."
          defaultValue={search}
          id="searchInput"
          className="w-full max-w-md px-4 py-2 border rounded-md shadow-sm text-black"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
        {search && (
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} linkPrefix="/blog" />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">{paginationButtons}</div>
    </section>
  );
};
export default BlogsPage;
