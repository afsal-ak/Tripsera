import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getAllWishlist, deleteFromWishlist } from '@/services/user/wishlistService';
import { Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { WishlistItem } from '@/types/IWishlist';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getAllWishlist(currentPage, limit);
        console.log(data, 'wifhlist');
        setWishlist(data.data || []);
        setTotalPages(data.totalPage);
      } catch (err) {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [searchParams]);

  //const image = wishlist.imageUrls[0]?.url.replace("/upload/", "/upload/f_auto,q_auto/") || "";

  const handleDelete = async (packageId: string) => {
    try {
      await deleteFromWishlist(packageId);
      toast.success('Removed from wishlist');
      setWishlist((prev) => prev.filter((item) => item.packageId._id !== packageId));
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  if (loading) {
    return <p className="p-4 text-center">Loading wishlist...</p>;
  }
  if (!wishlist.length)
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500">Start adding your favorite packages!</p>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const pkg = item.packageId;
          return (
            <div key={pkg._id} className="bg-white rounded-lg shadow p-4 relative">
              <Link to={`/packages/${pkg._id}`} className="block hover:opacity-90 transition">
                <img
                  src={pkg.imageUrls[0]?.url.replace('/upload/', '/upload/f_auto,q_auto/') || ''}
                  alt={pkg.title}
                  className="h-40 w-full object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold">{pkg.title}</h3>

                <p className="text-sm text-gray-600 ">
                  <MapPin className="w-3 h-3 mr-3" />
                  {pkg.location.map((loc) => loc.name).join(', ')}
                </p>
                <p className="text-sm text-gray-800 font-medium mt-1">
                  ₹ {pkg.price.toLocaleString()}
                </p>
              </Link>
              <ConfirmDialog
                title="Delete this wishlist?"
                actionLabel="Delete"
                onConfirm={() => handleDelete(pkg._id)}
              >
                <button
                  className="absolute top-2 right-2 p-2 rounded-full text-red-500 hover:bg-red-100"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </ConfirmDialog>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        {paginationButtons}
      </div>
    </div>
  );
};

export default Wishlist;
