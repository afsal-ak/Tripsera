import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/features/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/components/ui/Table";
import { ConfirmDialog } from "@/features/components/ui/ConfirmDialog";
import { usePaginationButtons } from "@/features/hooks/usePaginationButtons";

import type { ICoupon } from "@/features/types/ICoupon";
import { fetchCouponData,changeCouponStatus } from "@/features/services/admin/couponService";

const CouponList = () => {
  const navigate = useNavigate();
 
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
 const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
   const limit = parseInt(searchParams.get("limit") || "10", 10);

 useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const res = await fetchCouponData(currentPage, limit);
       setCoupons(res.coupons);
    console.log("coupons response", res.data);

      setTotalPages(res.totalPages); 
    } catch (error) {
      console.error("Failed to load coupons data:", error);
    }
  };
  fetchCoupons();
}, [searchParams]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });


  const handleToggleBlock = async (id: string, isActive: boolean) => {
 
    try {
      await changeCouponStatus(id,{isActive});
      toast.success(
        isActive ? "Coupon activated successfully" : "Coupon blocked successfully"
      );
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isActive } : c
        )
      );
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error toggling block status", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupons</CardTitle>
        <Button onClick={() => navigate("/admin/coupon/add")}>
          Add Coupons
        </Button>
      </CardHeader>
      <CardContent>
    <Table>
  <TableHeader>
    <TableRow>
      <TableHead>SI No</TableHead>
      <TableHead>Code</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Discount</TableHead>
      <TableHead>Min Amount</TableHead>
      <TableHead>Max Discount</TableHead>
      <TableHead>Expiry Date</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {coupons.map((coupon, index) => (
      <TableRow key={coupon._id}>
        <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
        <TableCell>{coupon.code}</TableCell>
        <TableCell>{coupon.type}</TableCell>
        <TableCell>
          {coupon.type === "percentage"
            ? `${coupon.discountValue}%`
            : `₹${coupon.discountValue}`}
        </TableCell>
        <TableCell>{coupon.minAmount ? `₹${coupon.minAmount}` : "-"}</TableCell>
        <TableCell>{coupon.maxDiscountAmount ? `₹${coupon.maxDiscountAmount}` : "-"}</TableCell>
        <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
        <TableCell>
          {coupon.isActive ? (
            <span className="text-green-500">Active</span>
          ) : (
            <span className="text-red-500">Blocked</span>
          )}
        </TableCell>
        
        <TableCell className="flex gap-2">
          
            <ConfirmDialog
                    title={
                      coupon.isActive
                        ? "Block this Coupon?"
                        : "Unblock this Coupon?"
                    }
                    actionLabel={coupon.isActive ? "Block" : "Unblock"}
                    onConfirm={() =>
                      handleToggleBlock(coupon._id, !coupon.isActive)
                    }
                  >
                    <Button
                      size="sm"
                      variant={coupon.isActive ? "destructive" : "outline"}
                      className={
                        coupon.isActive
                          ? ""
                          : "text-green-600 border-green-600"
                      }
                    >
                      {coupon.isActive ? "Block" : "Unblock"}
                    </Button>
                  </ConfirmDialog>
                   <Button
                    onClick={() => navigate(`/admin/coupon/edit/${coupon._id}`)}
                    className="border-orange text-orange"
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      </CardContent>
 <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    {paginationButtons}
    </div>
    </Card>
    
  );
};

export default CouponList;
