import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

import type { IPackage } from '@/types/IPackage';
import { fetchPackagesData, blockPackage, unBlockPackage } from '@/services/admin/packageService';

import { FilterBar } from '@/components/FilterBar ';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useDebounce } from 'use-debounce';
import { useCleanFilter } from '@/hooks/useCleanFilter ';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';

const PackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<IPackage[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
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
    rating,
    setRating,
    setSort,
    applyFilters,
  } = useSearchFilters();
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const cleanFilter = useCleanFilter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const rawFilters = {
          search: debouncedSearch,
          status: statusFilter,
          sort,
          startDate,
          endDate,
          rating,
        };
        const filters = cleanFilter(rawFilters);

        const res = await fetchPackagesData(currentPage, limit, filters);

        console.log('Pagination response', res);
        setPackages(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Failed to load package data:', error);
      }
    };
    fetchPackages();
  }, [debouncedSearch, searchParams, currentPage]);
  console.log(packages);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
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

  // Handlers passed to FilterBar
  const handleSearchChange = (val: string) => setSearchQuery(val);
  const handleStatusChange = (val: string) => setStatusFilter(val);
  const handleSortChange = (val: string) => setSort(val);
  const handleRatingChange = (val: string) => setRating(val);

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setSort('');
    setRating('');
    setSearchParams({ page: '1' });
  };

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    const action = shouldBlock ? 'block' : 'unblock';

    try {
      if (shouldBlock) {
        await blockPackage(id);
        toast.success('Package blocked successfully');
      } else {
        await unBlockPackage(id);
        toast.success('Package unblocked successfully');
      }

      // Update state after toggle
      setPackages((prev) =>
        prev.map((pkg) => (pkg._id === id ? { ...pkg, isBlocked: shouldBlock } : pkg))
      );
    } catch (error) {
      toast.error(`Failed to ${action} package`);
      console.error('Error toggling block status', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packages</CardTitle>
        <Button onClick={() => navigate('/admin/packages/add')}>Add Packages</Button>
      </CardHeader>
      <CardContent>
        <FilterBar
          searchValue={searchQuery}
          statusValue={statusFilter}
          startDateValue={startDate}
          endDateValue={endDate}
          sortValue={sort}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSortChange={handleSortChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          statusOptions={[
            { value: 'active', label: 'Active' },
            { value: 'blocked', label: 'Blocked' },
          ]}
          sortOptions={[
            { value: 'asc', label: 'Newest' },
            { value: 'desc', label: 'Oldest' },
          ]}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg, index) => (
              <TableRow key={pkg._id}>
                <TableCell>{(currentPage - 1) * 3 + index + 1}</TableCell>
                <TableCell>{pkg.title}</TableCell>
                <TableCell>{pkg.price}</TableCell>
                <TableCell>{pkg.finalPrice}</TableCell>
                <TableCell>
                  {pkg.isBlocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/admin/package/edit/${pkg._id}`)}
                    className="border-orange text-orange"
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {pkg.isBlocked ? (
                    <ConfirmDialog
                      title="Unblock this package?"
                      actionLabel="Unblock"
                      onConfirm={() => handleToggleBlock(pkg?._id!, false)}
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
                      title="Block this package?"
                      actionLabel="Block"
                      onConfirm={() => handleToggleBlock(pkg._id!, true)}
                    >
                      <Button size="sm" variant="destructive">
                        Block
                      </Button>
                    </ConfirmDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {paginationButtons}
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageList;
