import { useState, useEffect } from 'react';
import PackageFilterSidebar from '@/components/user/PackageFilterSidebar';
import PackageCard from '@/components/user/PackageCard';
import type { IPackage } from '@/types/IPackage';
import { fetchActivePackages } from '@/services/user/PackageService';
import { useSearchParams } from 'react-router-dom';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';


const Packages = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const filters = {
    category: searchParams.get('category') || '',
    duration: searchParams.get('duration') || '',
    sort: (searchParams.get('sort') || 'newest') as
      | 'newest'
      | 'oldest'
      | 'price_asc'
      | 'price_desc',
    search: searchParams.get('search') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  };

  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await fetchActivePackages({
        page: currentPage,
        limit,
        category: filters.category,
        duration: filters.duration,
        sort: filters.sort,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setPackages(res.data);
      setTotalPages(res.pagination.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error('Failed to load packages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [searchParams]);

  const handleFilterChange = (newFilters: any) => {
    setSearchParams({
      ...newFilters,
      page: '1',
    });
  };

  const handleClear = () => {
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      ...filters,
      page: String(newPage),
    });
  };

  // Debounced search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      setSearchParams({
        ...filters,
        search: value,
        page: '1',
      });
    }, 600); // debounce delay

    setDebounceTimer(timer);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({
      ...filters,
      search: '',
      page: '1',
    });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange via-red-500 to-orange-700 bg-clip-text text-transparent mb-4">
            Explore Packages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting travel experiences and curated tour packages made just for you.
          </p>
        </div>

        {/* ===== Search Section ===== */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 p-1 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="relative flex-1 w-full">
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search destinations, categories, or trip names..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full pl-12 pr-4 py-3 text-gray-700 bg-transparent border-none rounded-xl focus:outline-none focus:ring-0 placeholder-gray-400"
              />
            </div>

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ===== Mobile Filter Toggle Button ===== */}
        <div className="md:hidden flex justify-center mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-orange text-white px-5 py-2 rounded-xl shadow-md hover:bg-orange-600 transition-all duration-200"
          >
            <SlidersHorizontal size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* ===== Layout ===== */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar (visible based on toggle on mobile) */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64`}>
            <PackageFilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClear}
            />
          </div>

          {/* ===== Main Content ===== */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : packages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg._id} pkg={pkg} />
                  ))}
                </div>

                 {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-1 p-2 bg-white rounded-xl shadow-md border border-gray-200">
                    {paginationButtons}
                  </div>
                </div>


              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
                  alt="No packages"
                  className="w-32 h-32 mb-4 opacity-70"
                />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No Packages Found
                </h2>
                <p className="text-gray-500 text-center max-w-md">
                  Try adjusting your filters or searching with different keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
