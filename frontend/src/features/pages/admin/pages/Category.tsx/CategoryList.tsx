import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";

import { Button } from "@/features/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/components/ui/Table";
import { ConfirmDialog } from "@/features/components/ui/ConfirmDialog";

import type { ICategory } from "@/features/types/ICategory";
import { fetchCategoriesData, blockCategory, unBlockCategory } from "@/features/services/admin/categoryService";

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetchCategoriesData(currentPage, 3);
      console.log("Pagination response", res);
      setCategories(res.data);
      setTotalPages(res.totalPages); 
    } catch (error) {
      console.error("Failed to load category data:", error);
    }
  };
  fetchCategories();
}, [currentPage]);

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    const action = shouldBlock ? "block" : "unblock";

    try {
      if (shouldBlock) {
        await blockCategory(id);
        toast.success("Category blocked successfully");
      } else {
        await unBlockCategory(id);
        toast.success("Category unblocked successfully");
      }

      // Update state after toggle
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === id ? { ...cat, isBlocked: shouldBlock } : cat
        )
      );
    } catch (error) {
      toast.error(`Failed to ${action} category`);
      console.error("Error toggling block status", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <Button onClick={() => navigate("/admin/categories/add")}>
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id}>
                <TableCell>{cat._id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  {cat.isBlocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/admin/categories/edit/${cat._id}`)}
                    className="border-orange text-orange"
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
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

    </Card>
    
  );
};

export default CategoryList;
