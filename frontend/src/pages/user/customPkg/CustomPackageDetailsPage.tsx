import { useEffect, useState } from "react";
import { useNavigate, useParams,useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Loader2, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getCustomPkgById, deleteCustomPkg } from "@/services/user/customPkgService";
import type { ICustomPackage } from "@/types/ICustomPkg";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { usePaginationButtons } from "@/hooks/usePaginationButtons";
const CustomPackageDetails = () => {
  const { pkgId } = useParams();
  const [pkg, setPkg] = useState<ICustomPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();


    const [totalPages, setTotalPages] = useState(1);
   
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
  
    const handlePageChange = (page: number) => {
      setSearchParams({ page: page.toString(), limit: limit.toString() });
    };
  
    
  // Fetch package details
  useEffect(() => {
    if (!pkgId) return;
    const fetchPkg = async () => {
      try {
        const response = await getCustomPkgById(pkgId);
        setPkg(response.data);
       } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch package details");
      } finally {
        setLoading(false);
      }
    };
    fetchPkg();
  }, [pkgId]);

  // Delete handler
  const handleDelete = async () => {
    if (!pkgId) return;
    try {
      setDeleting(true);
      await deleteCustomPkg(pkgId);
      toast.success("Package deleted successfully");
      navigate("/account/my-custom-package");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete package");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!pkg) {
    return <p className="text-center text-gray-500">Package not found.</p>;
  }

  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      case "inProgress":
        return "bg-blue-500";
      case "completed":
        return "bg-purple-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Card className="p-6 shadow-2xl rounded-2xl border border-gray-100 bg-white">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Package Details
          </CardTitle>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate(`/account/my-custom-package/edit/${pkgId}`)}
            >
              <Edit3 size={16} />
              Edit
            </Button>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
              title="Delete Package?"
              actionLabel="Delete"
               onConfirm={handleDelete}
            >
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                className="flex items-center gap-2"
                onClick={() => setShowDeleteConfirm(true)}
              >
                {deleting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 size={16} />}
                Delete
              </Button>
            </ConfirmDialog>
          </div>
        </CardHeader>

        {/* Package Info */}
        <CardContent className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoBlock label="Destination" value={pkg.destination} />
            <InfoBlock
              label="Trip Type"
              value={pkg.tripType === "other" ? pkg.otherTripType || "Other" : pkg.tripType}
            />
            <InfoBlock label="Budget" value={`₹ ${pkg.budget.toLocaleString()}`} />
            <InfoBlock
              label="Start Date"
              value={new Date(pkg.startDate).toLocaleDateString("en-IN")}
            />
            <InfoBlock label="Days" value={`${pkg.days} Days`} />
            <InfoBlock label="Nights" value={`${pkg.nights} Nights`} />
            <InfoBlock label="Adults" value={pkg.adults} />
            <InfoBlock label="Children" value={pkg.children || 0} />
            <InfoBlock
              label="Accommodation"
              value={pkg.accommodation.charAt(0).toUpperCase() + pkg.accommodation.slice(1)}
            />
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <Badge className={`${getStatusColor(pkg.status)} text-white px-3 py-1`}>
                {pkg.status}
              </Badge>
            </div>
          </div>

          {/* Additional Details */}
          {pkg.additionalDetails && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700">Additional Details</h3>
              <p className="text-gray-700 mt-2">{pkg.additionalDetails}</p>
            </div>
          )}

          {/* Admin Response */}
          {pkg.adminResponse && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm mt-6">
              <h3 className="text-lg font-semibold text-blue-700">Admin Response</h3>
              <p className="text-gray-700 mt-1">{pkg.adminResponse}</p>
            </div>
          )}

          {/* Guest Info */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-2">Guest Information</h3>
            {pkg.guestInfo ? (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-2">
                <p><strong>Name:</strong> {pkg.guestInfo.name}</p>
                <p><strong>Email:</strong> {pkg.guestInfo.email}</p>
                <p><strong>Phone:</strong> {pkg.guestInfo.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No guest info available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoBlock = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default CustomPackageDetails;
