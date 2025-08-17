import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Search, Filter, MoreHorizontal, Shield, ShieldOff } from "lucide-react"
import { Input } from '@/components/ui/Input';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

import type { IUser } from '@/types/IUser';
import { fetchUsersData, toggleBlockUser } from '@/services/admin/userService';
const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchUsersData(currentPage, 5);
        console.log(res, 'users')
        setUsers(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    fetchUsers();
  }, [currentPage]);

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    try {
      if (shouldBlock) {
        await toggleBlockUser(id);
        toast.success('User blocked successfully');
      } else {
        await toggleBlockUser(id);
        toast.success('User unblocked successfully');
      }

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, isBlocked: shouldBlock } : user))
      );
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Block/unblock error:', error);
    }
  };
  const handleNaviageDetail = (id: string) => {
    navigate(`/admin/users/${id}`)
  }

   // const [statusFilter, setStatusFilter] = useState<string>("all")
  // const [searchTerm, setSearchTerm] = useState("")
  // const getInitials = (name: string) => {
  //   return name.split(' ').map(n => n[0]).join('').toUpperCase()
  // }

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user?.username!.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user?._id!.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesStatus = statusFilter === "all" || user?.isBlocked! === true
  //   return matchesSearch && matchesStatus
  // })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
          {/* <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{(currentPage - 1) * 5 + index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isBlocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
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
                    onClick={() => handleNaviageDetail(user?._id!)}
                  >
                    View Details
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
