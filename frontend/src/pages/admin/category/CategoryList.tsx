import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit, Search, X } from 'lucide-react';
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
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { useDebounce } from 'use-debounce';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import {
  fetchCategoriesData,
  blockCategory,
  unBlockCategory,
} from '@/services/admin/categoryService';
import type { ICategory } from '@/types/ICategory';

const CategoryList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [debouncedSearch] = useDebounce(searchInput, 500);
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  // Fetch data
  const fetchCategories = async (
    page = currentPage,
    search = debouncedSearch,
    statusValue = status
  ) => {
    try {
      const res = await fetchCategoriesData(page, limit, search, statusValue);
      setCategories(res.data);
      setTotalPages(res.pagination.totalPages);
      console.log(totalPages, 'pages');
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, debouncedSearch, status]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [debouncedSearch, status, currentPage]);

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    try {
      if (shouldBlock) {
        await blockCategory(id);
        toast.success('Category blocked successfully');
      } else {
        await unBlockCategory(id);
        toast.success('Category unblocked successfully');
      }

      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? { ...cat, isBlocked: shouldBlock } : cat))
      );
    } catch {
      toast.error(`Failed to ${shouldBlock ? 'block' : 'unblock'} category`);
    }
  };

  //  Clear all filters and reload unfiltered data
  const handleClearAll = async () => {
    setSearchInput('');
    setStatus('');
    setCurrentPage(1);
    setSearchParams({});
    await fetchCategories(1, '', '');
  };

  return (
    <Card className="shadow-sm border border-gray-200 rounded-xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Categories</CardTitle>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          {/* 🔍 Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-8 focus-visible:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 🧩 Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* 🧹 Clear + Add */}
          <div className="flex gap-2">
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Clear All
            </Button>

            <Button
              onClick={() => navigate('/admin/categories/add')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Category
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat, index) => (
                <TableRow key={cat._id}>
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    {cat.isBlocked ? (
                      <span className="text-red-600 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/admin/categories/edit/${cat._id}`)}
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {cat.isBlocked ? (
                      <ConfirmDialog
                        title="Unblock this category?"
                        actionLabel="Unblock"
                        onConfirm={() => handleToggleBlock(cat._id, false)}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Unblock
                        </Button>
                      </ConfirmDialog>
                    ) : (
                      <ConfirmDialog
                        title="Block this category?"
                        actionLabel="Block"
                        onConfirm={() => handleToggleBlock(cat._id, true)}
                      >
                        <Button size="sm" variant="destructive">
                          Block
                        </Button>
                      </ConfirmDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </Card>
  );
};

export default CategoryList;
