import { useState, useEffect } from 'react';

import PackageFilterSidebar from '@/components/user/PackageFilterSidebar';
import PackageCard from '@/components/user/PackageCard';
import type { IPackage } from '@/types/homeTypes';
import { fetchActivePackages } from '@/services/user/PackageService';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

const Packages = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    // location: searchParams.get("location") || "",
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

  const currentPage = parseInt(searchParams.get('page') || '1');

  const loadPackages = async () => {
    try {
      const res = await fetchActivePackages({
        page: currentPage,
        limit: 9,
        category: filters.category,
        duration: filters.duration,
        sort: filters.sort,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      setPackages(res.data);
      setTotalPages(res.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error('Failed to load packages', error);
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

  const handleSearch = () => {
    setSearchParams({
      ...filters,
      search: searchQuery,
      page: '1',
    });
  };
  const handleSearchClear = () => {
    setSearchQuery('');
    setSearchParams({
      ...filters,
      search: '',
      page: '1',
    });
  };
  return (
    <>
      <div className="bg-background min-h-screen py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
          <PackageFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Available Packages</h2>

            <div className="flex flex-col sm:flex-row items-center justify-end mb-6 gap-2">
              <input
                type="text"
                placeholder="Search packages... "
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(() => e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchParams({
                      ...filters,
                      search: searchQuery,
                      page: '1',
                    });
                  }
                }}
                className="w-full sm:w-64 border border-border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange text-sm"
              />

              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="text-sm text-gray-500 hover:text-red-500 transition"
                >
                  ✖
                </button>
              )}

              <button
                onClick={handleSearch}
                className="bg-orange hover:bg-orange-dark text-white text-sm px-4 py-2 rounded-md transition"
              >
                <Search size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.length > 0 ? (
                packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
              ) : (
                <p className="text-muted-foreground">No packages found.</p>
              )}
            </div>
            {/* <div className="flex justify-center mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="mx-2 px-4 py-2 bg-gray-300 dark:bg-border text-black dark:text-white rounded"
              >
                Prev
              </button>
              <span className="text-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="mx-2 px-4 py-2 bg-gray-300 dark:bg-border text-black dark:text-white rounded"
              >
                Next
              </button>
            </div> */}

            <div className="flex justify-center mt-6 items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1.5 text-sm rounded border ${page === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-border'
                    : 'bg-orange text-white hover:bg-orange/90'
                  }`}
              >
                Prev
              </button>

              <span className="text-sm text-foreground px-2">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1.5 text-sm rounded border ${page === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-border'
                    : 'bg-orange text-white hover:bg-orange/90'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;
