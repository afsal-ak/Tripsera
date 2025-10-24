import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { getAllActiveCoupon } from '@/services/user/couponService';
import type { ICoupon } from '@/types/ICoupon';
import { toast } from 'sonner';

const CouponList = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await getAllActiveCoupon(currentPage, limit);
        setCoupons(res.coupons);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Coupon fetch error', error);
        toast.error('Failed to fetch coupons');
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

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-extrabold text-orange text-center mb-8">
        🎁 Grab Your Coupons
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative rounded-2xl shadow-md bg-gradient-to-br from-orange/10 to-white border border-orange/20 hover:shadow-lg transition-all duration-300 group overflow-hidden"
          >
            {/* Discount Tag */}
            <div className="absolute top-0 right-0 bg-orange text-white text-xs px-3 py-1 rounded-bl-xl font-bold shadow-sm">
              {coupon.type === 'percentage'
                ? `${coupon.discountValue}% OFF`
                : `₹${coupon.discountValue} OFF`}
            </div>

            {/* Coupon Content */}
            <div className="p-5">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Coupon Code</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-orange tracking-wide">
                    {coupon.code}
                  </h3>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="bg-orange text-white text-xs px-3 py-1 rounded-md hover:bg-orange-dark transition-all shadow-sm active:scale-95"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  Min Purchase:{' '}
                  <span className="font-semibold">₹{coupon.minAmount || 0}</span>
                </p>
                <p>
                  Max Discount:{' '}
                  <span className="font-semibold">
                    ₹{coupon.maxDiscountAmount || '-'}
                  </span>
                </p>
                <p>
                  Valid Till:{' '}
                  <span className="font-semibold text-orange-dark">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            {/* Animated Bottom Border */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange transition-all duration-500 group-hover:w-full" />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        {paginationButtons}
      </div>
    </div>
  );
};

export default CouponList;
