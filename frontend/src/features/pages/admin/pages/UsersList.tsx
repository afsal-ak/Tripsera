import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Edit } from "lucide-react";

import { Button } from "@/features/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/components/ui/Table";
import { ConfirmDialog } from "@/features/components/ui/ConfirmDialog";

import type { IUser } from "@/features/types/IUser";
import { fetchUsersData,blockUser,unBlockUser } from "@/features/services/admin/userService";
const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchUsersData(currentPage, 5); 
        setUsers(res.data);
        setTotalPages(res.totalPages); 
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    fetchUsers();
  }, [currentPage]);

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    try {
      if (shouldBlock) {
        await blockUser(id);
        toast.success("User blocked successfully");
      } else {
        await unBlockUser(id);
        toast.success("User unblocked successfully");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: shouldBlock } : user
        )
      );
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Block/unblock error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
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
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
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
                      onConfirm={() => handleToggleBlock(user._id, false)}
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
                      onConfirm={() => handleToggleBlock(user._id, true)}
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
