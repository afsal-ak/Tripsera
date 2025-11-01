import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit, Eye } from 'lucide-react';

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
    customFilter,
    setCustomFilter,
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
          custom: customFilter,
          sort,
          startDate,
          endDate,
          rating,
        };
        const filters = cleanFilter(rawFilters);

        const res = await fetchPackagesData(currentPage, limit, filters);

        console.log('Pagination response', res);
        setPackages(res.data);
        setTotalPages(res.pagination.totalPages);
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
  const handleCustomFilterChange = (val: string) => setCustomFilter(val);

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
    setCustomFilter('')
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
          customFilterValue={customFilter}
          onCustomFilterChange={handleCustomFilterChange}
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

          customOption={[
            { value: 'all', label: 'All Packages' },
            { value: 'normal', label: 'Normal Packages' },
            { value: 'group', label: 'Group Packages' },
            { value: 'custom', label: 'Custom Packages' },
          ]}
        />
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {packages.map((pkg, index) => {
              const today = new Date();

              // Determine if package is expired (either departureDate or endDate before today)
              const isExpired =
                (pkg.departureDates && new Date(pkg.departureDates) < today) ||
                (pkg.endDate && new Date(pkg.endDate) < today);

              return (
                <TableRow key={pkg._id}>
                  <TableCell>{(currentPage - 1) * 3 + index + 1}</TableCell>

                  <TableCell className="font-medium">{pkg.title}</TableCell>

                  <TableCell>
                    {pkg.packageType === 'custom' ? (
                      <span className="text-blue-500 font-medium">Custom Package</span>
                    ) : pkg.packageType === 'group' ? (
                      <span className="text-purple-500 font-medium">Group Package</span>
                    ) : (
                      <span className="text-green-500 font-medium">Normal Package</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">₹{pkg.price}</span>
                      {pkg.packageType === 'group' && (
                        <span className="text-xs text-gray-500 mt-1">
                          Available Slots:{' '}
                          <span className="font-semibold text-gray-700">
                            {pkg.availableSlots ?? 'N/A'}
                          </span>
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>₹{pkg.finalPrice}</TableCell>

                  <TableCell>
                    {pkg.isBlocked ? (
                      <span className="text-red-500 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-500 font-medium">Active</span>
                    )}
                  </TableCell>

                  {/*  Expiry status based on date */}
                  <TableCell>
                    {isExpired ? (
                      <span className="text-red-500 font-medium">Expired</span>
                    ) : (
                      <span className="text-green-500 font-medium">Valid</span>
                    )}
                  </TableCell>

                  <TableCell className="flex gap-2 items-center">
  <Button
    onClick={() => navigate(`/admin/package/edit/${pkg._id}`)}
    className="border-orange text-orange"
    variant="outline"
    size="sm"
  >
    <Edit className="h-4 w-4" />
  </Button>

  <Button
    onClick={() => navigate(`/admin/package/${pkg._id}`)}
    className="border-blue-500 text-blue-500"
    variant="outline"
    size="sm"
    title="View Details"
  >
    <Eye className="h-4 w-4" />
  </Button>

  {pkg.isBlocked ? (
    <ConfirmDialog
      title="Unblock this package?"
      actionLabel="Unblock"
      onConfirm={() => handleToggleBlock(pkg._id!, false)}
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
              );
            })}
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
