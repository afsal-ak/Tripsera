import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
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
import { Search, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import type { IUser } from '@/types/IUser';
import { fetchUsersData, toggleBlockUser } from '@/services/admin/userService';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import type { IFilter } from '@/types/IFilter';
const UserList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState<IUser[]>([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const filters: IFilter = {
          page: currentPage,
          limit,
          search: debouncedSearch,
          status,
        };
        const res = await fetchUsersData(filters);
        console.log(res, 'ress');

        setUsers(res.data);
        setTotalPages(res.pagination.totalPages);
      } catch (error) {
        toast.error('Failed to load user data');
      }
    };
    fetchUsers();
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
      await toggleBlockUser(id);
      toast.success(`User ${shouldBlock ? 'blocked' : 'unblocked'} successfully`);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, isBlocked: shouldBlock } : user))
      );
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleClearAll = async () => {
    setSearchInput('');
    setStatus('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleNavigateDetail = (id: string) => {
    navigate(`/admin/users/${id}`);
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <CardTitle className="text-xl font-semibold">Users</CardTitle>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-8"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status filter */}
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

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isBlocked ? (
                      <span className="text-red-600 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {user.isBlocked ? (
                      <ConfirmDialog
                        title="Unblock this user?"
                        actionLabel="Unblock"
                        onConfirm={() => handleToggleBlock(user._id!, false)}
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
                        title="Block this user?"
                        actionLabel="Block"
                        onConfirm={() => handleToggleBlock(user._id!, true)}
                      >
                        <Button size="sm" variant="destructive">
                          Block
                        </Button>
                      </ConfirmDialog>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleNavigateDetail(user._id!)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </Card>
  );
};

export default UserList;
