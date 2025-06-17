import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";

import { Button } from "@/features/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/components/ui/Table";
import { ConfirmDialog } from "@/features/components/ui/ConfirmDialog";


import type { IPackage } from "@/features/types/IPackage";
 import { fetchPackagesData,blockPackage,unBlockPackage } from "@/features/services/admin/packageService";
const PackageList = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
  const fetchPackages = async () => {
    try {
      const res = await fetchPackagesData(currentPage, 3);

      console.log("Pagination response", res);
      setPackages(res.data);
      setTotalPages(res.totalPages); 
    } catch (error) {
      console.error("Failed to load package data:", error);
    }
  };
  fetchPackages();
}, [currentPage]);
console.log(packages)
  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    const action = shouldBlock ? "block" : "unblock";

    try {
      if (shouldBlock) {
        await blockPackage(id);
        toast.success("Package blocked successfully");
      } else {
        await unBlockPackage(id);
        toast.success("Package unblocked successfully");
      }

      // Update state after toggle
      setPackages((prev) =>
        prev.map((pkg) =>
          pkg._id === id ? { ...pkg, isBlocked: shouldBlock } : pkg
        )
      );
    } catch (error) {
      toast.error(`Failed to ${action} package`);
      console.error("Error toggling block status", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Packages</CardTitle>
        <Button onClick={() => navigate("/admin/packages/add")}>
          Add Packages
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg,index) => (
              <TableRow key={pkg._id}>
<TableCell>{(currentPage - 1) * 3 + index + 1}</TableCell>
                <TableCell>{pkg.title}</TableCell>
                  <TableCell>
                {pkg.category?.map((cat) => (
                    <div key={cat._id} className="text-sm text-gray-700">
                    {cat.name}
                    </div>
                ))}
                </TableCell>
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

export default PackageList;
