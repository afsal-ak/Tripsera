import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

import type { IBanner } from "@/features/types/IBanner";
import { fetchBannerData, blockBanner, unBlockBanner, deleteBanner } from "@/features/services/admin/bannerService";

import { Button } from "@/features/components/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/features/components/ui/Card";
import { ConfirmDialog } from "@/features/components/ui/ConfirmDialog";

const BannerList = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetchBannerData(currentPage, 3);
        setBanners(res.data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Failed to load banners:", error);
      }
    };
    fetchBanners();
  }, [currentPage]);

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    try {
      if (shouldBlock) {
        await blockBanner(id);
        toast.success("Banner blocked successfully");
        // Update UI by removing the deleted banner from state
    setBanners((prev) =>
      prev.filter((banner) => banner._id.toString() !== id)
    );

      } else {
        await unBlockBanner(id);
        toast.success("Banner unblocked successfully");
      }

      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === id ? { ...banner, isBlocked: shouldBlock } : banner
        )
      );
    } catch (error) {
      toast.error("Failed to update banner status");
      console.error("Block/unblock error:", error);
    }
  };
const handleDelete = async (id: string) => {
  try {
    await deleteBanner(id); // Call backend
    toast.success("Banner deleted successfully");

    // Update UI by removing the deleted banner from state
    setBanners((prev) =>
      prev.filter((banner) => banner._id.toString() !== id)
    );
  } catch (error) {
    toast.error("Failed to delete banner");
    console.error("Delete error:", error);
  }
};


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Banners</h2>
        <Button onClick={() => navigate("/admin/banners/add")}>Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner._id}>
            <CardHeader>
              <CardTitle>{banner.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <img
                src={banner.image?.url}
                alt={banner.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-gray-600 text-center">{banner.description}</p>
              <span
                className={`mt-2 text-sm font-medium ${
                  banner.isBlocked ? "text-red-600" : "text-green-600"
                }`}
              >
                {banner.isBlocked ? "Blocked" : "Active"}
              </span>
              <div className="mt-3 flex gap-2">
              <ConfirmDialog
    title="Are you sure you want to delete this banner?"
    actionLabel="Delete"
    onConfirm={() => handleDelete(banner._id)}
  >
    <Button size="sm" variant="destructive">
      Delete
    </Button>
  </ConfirmDialog>

                {banner.isBlocked ? (
                  <ConfirmDialog
                    title="Unblock this banner?"
                    actionLabel="Unblock"
                    onConfirm={() => handleToggleBlock(banner._id, false)}
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
                    title="Block this banner?"
                    actionLabel="Block"
                    onConfirm={() => handleToggleBlock(banner._id, true)}
                  >
                    <Button size="sm" variant="destructive">
                      Block
                    </Button>
                  </ConfirmDialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
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
    </div>
  );
};

export default BannerList;
