import { useEffect, useState } from 'react';
import BlogCard from '@/components/user/BlogCard';
import type { IBlog } from '@/types/IBlog';
import { fetchAllPublishedBlog } from '@/services/user/blogService';
import { useSearchParams } from 'react-router-dom';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
const BlogsPage = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [searchBlog, setSearchBlog] = useState('');
  const [loading, setLoading] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;

  const search = searchParams.get('search') || '';
  
  const handleSearch = () => {
    const input = document.getElementById('searchInput') as HTMLInputElement;
    setSearchParams({ search: input.value, page: '1', limit: limit.toString() });
  };

  const handleClearSearch = () => {
    const input = document.getElementById('searchInput') as HTMLInputElement;
    input.value = '';
    setSearchParams({ page: '1', limit: limit.toString() });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString(), ...(search && { search }) });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetchAllPublishedBlog(currentPage, limit, search);
        setBlogs(response.blogs);
        console.log(response);
        setTotalPages(Math.ceil(response.totalBlogs / limit));
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [searchParams]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Explore Blogs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insightful articles, tutorials, and stories from our community of writers
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="flex flex-col sm:flex-row items-center gap-3 p-1 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="relative flex-1 w-full">
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search blogs, topics, authors..."
                  defaultValue={search}
                  id="searchInput"
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 text-gray-700 bg-transparent border-none rounded-xl focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-2 px-2">
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Search
                </button>
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {search && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    Found <span className="font-semibold text-blue-600">{blogs.length}</span> results for 
                    <span className="font-semibold text-gray-800"> "{search}"</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
              <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0"></div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog, index) => (
                  <div 
                    key={blog._id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <BlogCard blog={blog} linkPrefix="/blog" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {search ? `No blogs found for "${search}"` : 'No blogs available'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {search ? 'Try adjusting your search terms' : 'Check back later for new content'}
                </p>
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Blogs
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Enhanced Pagination */}
        {!loading && blogs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-8">
            <div className="flex items-center gap-1 p-2 bg-white rounded-xl shadow-md border border-gray-200">
              {paginationButtons}
            </div>
          </div>
        )}
      </section>
 
    </div>
  );
};

export default BlogsPage;