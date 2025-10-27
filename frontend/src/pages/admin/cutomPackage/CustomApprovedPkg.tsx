import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';
import { useDebounce } from 'use-debounce';

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
import { FilterBar } from '@/components/FilterBar ';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useCleanFilter } from '@/hooks/useCleanFilter ';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import {  blockPackage, unBlockPackage } from '@/services/admin/packageService';

import type { CustomPackageApprovedResponseDTO } from '@/types/ICustomPkg';
import { fetchAllApprovedCustomPkg } from '@/services/admin/customPkgService';
const CustomApprovedPkg = () => {
  const navigate = useNavigate();
  const [customPackages, setCustomPackages] = useState<CustomPackageApprovedResponseDTO[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  // Custom filter logic hook
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
    setSort,
    applyFilters,
  } = useSearchFilters();

  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const cleanFilter = useCleanFilter();

  // 🔹 Fetch packages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawFilters = {
          search: debouncedSearch,
          status: statusFilter,
          sort,
          startDate,
          endDate,
        };
        const filters = cleanFilter(rawFilters);

        const res = await fetchAllApprovedCustomPkg(currentPage, limit, filters);
        setCustomPackages(res.data);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to fetch approved custom packages:', err);
        toast.error('Failed to load approved packages');
      }
    };
    fetchData();
  }, [debouncedSearch, currentPage, sort, statusFilter, startDate, endDate]);

  // 🔹 Update URL on search
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  }, [debouncedSearch]);

  // 🔹 Pagination
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

  // 🔹 Filter handlers
  const handleSearchChange = (val: string) => setSearchQuery(val);
  const handleStatusChange = (val: string) => setStatusFilter(val);
  const handleSortChange = (val: string) => setSort(val);
  const handleApplyFilters = () => applyFilters();
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setSort('');
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
      setCustomPackages((prev) =>
        prev.map((pkg) => (pkg._id === id ? { ...pkg, isBlocked: shouldBlock } : pkg))
      );
    } catch (error) {
      toast.error(`Failed to ${action} package`);
      console.error('Error toggling block status', error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Approved Custom Packages</CardTitle>
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
            { value: 'asc', label: 'Oldest' },
            { value: 'desc', label: 'Newest' },
          ]}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>User</TableHead>
              
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customPackages.map((pkg, index) => (
              <TableRow key={pkg._id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>{pkg.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {pkg.userDetails?.profileImage && (
                      <img
                        src={pkg.userDetails.profileImage.url!}
                        alt={pkg.userDetails.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{pkg.userDetails?.username}</p>
                      <p className="text-xs text-gray-500">{pkg.userDetails?.email}</p>
                    </div>
                  </div>
                </TableCell>
              
                <TableCell>₹{pkg.price}</TableCell>
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
                      onConfirm={() => handleToggleBlock(pkg._id, false)}
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
                      onConfirm={() => handleToggleBlock(pkg._id, true)}
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

export default CustomApprovedPkg;
