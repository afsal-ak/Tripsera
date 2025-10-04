import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { getAllBlogs } from '@/services/admin/blogService';
import type { IBlog } from '@/types/IBlog';


import { useDebounce } from 'use-debounce';
import { useCleanFilter } from '@/hooks/useCleanFilter ';
import { FilterBar } from '@/components/FilterBar ';
import { useSearchFilters } from '@/hooks/useSearchFilters';

const AdminBlogList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const cleanFilter = useCleanFilter()

  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);


  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sort,
    customFilter,
    setCustomFilter,
    setSort,
    applyFilters,
  } = useSearchFilters();

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const rawFilters = {
          search: debouncedSearch,
          status: statusFilter,
          sort,
          startDate,
          endDate,
          customFilter
        }
        const filter = cleanFilter(rawFilters)
        const response = await getAllBlogs(currentPage, limit, filter);
        console.log(response, 'bl;og res')
        setBlogs(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [searchParams]);
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params)
  }, [debouncedSearch])

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('page', page.toString())
      return newParams
    })
  }
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params)
  }, [debouncedSearch])


  // Handlers passed to FilterBar
  const handleSearchChange = (val: string) => setSearchQuery(val);
  const handleStatusChange = (val: string) => setStatusFilter(val);
  const handleSortChange = (val: string) => setSort(val);
  const handleReportType = (val: string) => setCustomFilter(val);

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setSort("");
    setCustomFilter("")
    setSearchParams({ page: "1" });
  };


  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });
   return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            searchValue={searchQuery}
            statusValue={statusFilter}
            startDateValue={startDate}
            endDateValue={endDate}
            sortValue={sort}
            customFilterValue={customFilter}
            customLabel="Report Type"

            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSortChange={handleSortChange}
            onCustomFilterChange={handleReportType}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            statusOptions={[
              { value: "active", label: "Active" },
              { value: "blocked", label: "Blocked" },
              // { value: "dismissed", label: "Dismissed" },
            ]}
            sortOptions={[
              { value: "asc", label: "Oldest" },
              { value: "desc", label: "Newest" },
            ]}

          />

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No blogs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog._id}>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.author?.username || 'N/A'}</TableCell>
                      <TableCell>{blog.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                      <TableCell>{new Date(blog.createdAt!).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/blogs/${blog._id}`)}
                        >
                          <Edit className="w-4 h-4 mr-2" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            {paginationButtons}
          </div>    
              </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogList;
