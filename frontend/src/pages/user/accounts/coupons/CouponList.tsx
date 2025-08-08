import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { getAllActiveCoupon } from '@/services/user/couponService';
import type { ICoupon } from '@/types/ICoupon';

const CouponList = () => {
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllActiveCoupon(currentPage, limit);
        setCoupons(res.coupons);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error('Coupon fetch error', error);
      }
    };
    fetch();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-6"> Grab Your Coupons</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative rounded-xl shadow-md bg-gradient-to-br from-orange-50 to-white border border-orange-200 hover:shadow-lg transition-all p-5"
          >
            {/* Discount Badge */}
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-3 py-1 rounded-bl-xl font-bold">
              {coupon.type === 'percentage'
                ? `${coupon.discountValue}% OFF`
                : `₹${coupon.discountValue} OFF`}
            </div>

            {/* Coupon Code */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">Coupon Code</p>
              <h3 className="text-xl font-bold text-orange-600 tracking-wider">{coupon.code}</h3>
            </div>

            {/* Details */}
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                Min Purchase: <span className="font-semibold">₹{coupon.minAmount || 0}</span>
              </p>
              <p>
                Max Discount:{' '}
                <span className="font-semibold">₹{coupon.maxDiscountAmount || '-'}</span>
              </p>
              <p>
                Valid Till:{' '}
                <span className="font-semibold">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Apply Button (Optional) */}
            {/* <button className="mt-4 w-full bg-orange-500 text-white rounded-md py-1 text-sm font-medium hover:bg-orange-600">
              Apply
            </button> */}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">{paginationButtons}</div>
    </div>
  );
};

export default CouponList;
