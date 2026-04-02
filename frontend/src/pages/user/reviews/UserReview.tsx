import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleUserReview } from '@/services/user/reviewService';
import type { IReview } from '@/types/IReview';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { Star } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTime';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import ReadMore from '@/components/ReadMore';

const UserReviewPage = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await handleUserReview(currentPage, limit);

        setReviews(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch {
        console.log('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
  };

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  const profileImage = user?.profileImage?.url || '/profile-default.jpg';

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h1>

      {/* 🔥 LOADING STATE */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 w-1/3 rounded" />
                  <div className="h-3 bg-gray-200 w-1/4 rounded" />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 w-1/2 rounded" />
                <div className="h-3 bg-gray-200 w-full rounded" />
                <div className="h-3 bg-gray-200 w-5/6 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* 🔥 EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          
          {/* ⭐ Icon */}
          <div className="text-5xl mb-4">⭐</div>

          {/* Heading */}
          <h3 className="text-xl font-semibold text-gray-800">
            No Reviews Yet
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            You haven’t written any reviews yet. Share your travel experience and help others choose better!
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate('/packages')}
            className="mt-5 px-5 py-2 bg-orange text-white rounded-lg text-sm hover:bg-orange-dark transition"
          >
            Explore Packages
          </button>
        </div>
      ) : (
        <>
          {/* ✅ REVIEW LIST */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                onClick={() => navigate(`/account/my-reviews/${review._id}`)}
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer"
              >
                {/* Top Row */}
                <div className="flex items-start gap-4">
                  <img
                    src={profileImage}
                    alt={review.username}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {user?.username}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(review.createdAt)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h4>
                  <ReadMore text={review.comment} wordLimit={10} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            {paginationButtons}
          </div>
        </>
      )}
    </div>
  );
};

export default UserReviewPage;
// import { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { handleUserReview } from '@/services/user/reviewService';
// import type { IReview } from '@/types/IReview';
// import { usePaginationButtons } from '@/hooks/usePaginationButtons';
// import { Star } from 'lucide-react';
// import { formatTimeAgo } from '@/lib/utils/formatTime';
// import { useSelector } from 'react-redux';
// import type { RootState } from '@/redux/store';
// import ReadMore from '@/components/ReadMore';

// const UserReviewPage = () => {
//   const user = useSelector((state: RootState) => state.userAuth.user);
//   const navigate = useNavigate();
//   const [reviews, setReviews] = useState<IReview[]>([]);
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [totalPages, setTotalPages] = useState(1);

//   const currentPage = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '5', 10);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await handleUserReview(currentPage, limit);

//         setReviews(response.data);
//         console.log(response.data, 'sgs');

//         setTotalPages(response.pagination.totalPages);
//       } catch {
//         console.log('Failed to fetch reviews');
//       }
//     };
//     fetchReviews();
//   }, [searchParams]);

//   const handlePageChange = (page: number) => {
//     setSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//     });
//   };

//   const paginationButtons = usePaginationButtons({
//     currentPage,
//     totalPages,
//     onPageChange: handlePageChange,
//   });

//   const profileImage = user?.profileImage?.url || '/profile-default.jpg';

//   const renderStars = (rating: number) => {
//     return [...Array(5)].map((_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//       />
//     ));
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h1>

//       <div className="space-y-6">
//         {reviews.map((review) => (
//           <div
//             key={review._id}
//             onClick={() => navigate(`/account/my-reviews/${review._id}`)}
//             className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 cursor-pointer"
//           >
//             {/* Top Row */}
//             <div className="flex items-start gap-4">
//               <img
//                 src={profileImage}
//                 alt={review.username}
//                 className="w-12 h-12 rounded-full object-cover border border-gray-200"
//               />
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold text-gray-900">{user?.username}</h3>
//                   <span className="text-xs text-gray-500">{formatTimeAgo(review.createdAt)}</span>
//                 </div>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mt-1">
//                   <div className="flex">{renderStars(review.rating)}</div>
//                   <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
//                 </div>
//               </div>
//             </div>

//             {/* Review Content */}
//             <div className="mt-4 border-t border-gray-100 pt-4">
//               <h4 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h4>
//               <ReadMore text={review.comment} wordLimit={10} />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
//         {paginationButtons}
//       </div>
//     </div>
//   );
// };

// export default UserReviewPage;
