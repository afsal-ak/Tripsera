import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getAllCustomPkg } from '@/services/user/customPkgService';
import type { ICustomPackage } from '@/types/ICustomPkg';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
const CustomPackagePage = () => {
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<ICustomPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };
  // Fetch all custom packages
  useEffect(() => {
    const fetchPkg = async () => {
      try {
        const response = await getAllCustomPkg(currentPage, limit);
        const data = response.data;
        setPkg(data);
        setTotalPages(response?.pagination?.totalPages);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to fetch packages');
      } finally {
        setLoading(false);
      }
    };
    fetchPkg();
  }, []);

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <Card className="p-6 shadow-xl border rounded-xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-semibold text-gray-800">My Custom Packages</CardTitle>
      </CardHeader>

      <CardContent>
        {pkg.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">No custom packages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all your custom travel packages</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Destination</TableHead>
                  <TableHead>Trip Type</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pkg.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-800">{item.destination}</TableCell>
                    <TableCell className="capitalize text-gray-700">{item.tripType}</TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      ₹ {item.budget.toLocaleString()}
                    </TableCell>
                    <TableCell>{new Date(item.startDate).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          item.status
                        )} text-white capitalize px-3 py-1 rounded-full`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      {/* Details Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/account/my-custom-package/${item.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" /> Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </Card>
  );
};

export default CustomPackagePage;
