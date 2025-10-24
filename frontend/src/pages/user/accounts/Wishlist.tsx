import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Trash2, MapPin, HeartOff } from 'lucide-react';
import { toast } from 'sonner';

import { getAllWishlist, deleteFromWishlist } from '@/services/user/wishlistService';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import type { IWishlist } from '@/types/IWishlist';
import { Button } from '@/components/Button';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<IWishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getAllWishlist(currentPage, limit);
        setWishlist(data.data || []);
        setTotalPages(data.totalPage);
      } catch {
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [searchParams]);

  const handleDelete = async (packageId: string) => {
    try {
      await deleteFromWishlist(packageId);
      toast.success('Removed from wishlist');
      setWishlist((prev) => prev.filter((item) => item.package._id !== packageId));
    } catch {
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
    return <p className="p-6 text-center text-gray-500 animate-pulse">Loading wishlist...</p>;
  }

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-orange/10 p-8 rounded-2xl shadow-md max-w-md">
          <HeartOff className="w-16 h-16 text-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-6">
            You haven’t added any packages yet. Start exploring and save your favorites!
          </p>
          <Link to="/packages">
            <Button className="bg-orange hover:bg-orange-dark text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Explore Packages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-orange mb-6">My Wishlist ❤️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const pkg = item.package;
          const image =
            pkg.imageUrls?.url?.replace('/upload/', '/upload/f_auto,q_auto/') || '/no-image.jpg';

          return (
            <div
              key={pkg._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
            >
              <Link to={`/packages/${pkg._id}`} className="block">
                <img
                  src={image}
                  alt={pkg.title}
                  className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-4">
                <Link to={`/packages/${pkg._id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-orange transition">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-1 text-orange" />
                    <span>{pkg.location?.map((loc) => loc.name).join(', ')}</span>
                  </div>

                  <p className="text-md font-semibold text-orange mt-1">
                    ₹ {pkg.price.toLocaleString()}
                  </p>
                </Link>

                <ConfirmDialog
                  title="Remove from Wishlist?"
                  actionLabel="Delete"
                  onConfirm={() => handleDelete(pkg._id)}
                >
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-red-100 text-red-500 shadow-sm transition"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </ConfirmDialog>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        {paginationButtons}
      </div>
    </div>
  );
};

export default Wishlist;
