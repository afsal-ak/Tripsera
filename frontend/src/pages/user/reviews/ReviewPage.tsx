// import { useState, useEffect } from 'react';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { handlePackageReview } from '@/features/services/user/reviewService';
// import type { IReview } from '@/features/types/IReview';
// import { usePaginationButtons } from '@/features/hooks/usePaginationButtons';
// import { Star } from 'lucide-react';
// import { formatTimeAgo } from '@/lib/utils/formatTime';

// const ReviewPage = () => {

//     const { packageId } = useParams()
//     const navigate = useNavigate()
//     const [reviews, setreviews] = useState<IReview[]>([]);
//     const [searchParams, setSearchParams] = useSearchParams()
//     const [totalPages, setTotalPages] = useState(1);

//     const currentPage = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '10', 10);

//     useEffect(() => {
//         if (!packageId) {
//             return
//         }
//         const fetchReviews = async () => {
//             try {
//                 const response = await handlePackageReview(packageId,currentPage,limit)
//                 console.log(response)
//                 setreviews(response.review)
//                 setTotalPages(response.pagination.totalPages);

//             } catch (error) {
//                 console.log('failed to fetch review')
//             }

//         }
//         fetchReviews()
//     }, [searchParams])
//     console.log(reviews, 'revies')
//     const handlePageChange = (page: number) => {
//         setSearchParams({
//             page: page.toString(),
//             limit: limit.toString(),
//         });
//     };
//     const paginationButtons = usePaginationButtons({
//         currentPage,
//         totalPages,
//         onPageChange: handlePageChange,
//     });



//   const handleAddReview = () => {
//     navigate(`/packages/${packageId}/review/add`);
//   };


//     return (
//         <div className="max-w-3xl mx-auto px-4 py-10">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-semibold text-gray-800">Customer Reviews</h1>
//                 <button onClick={handleAddReview} className="bg-orange text-white px-4 py-2 rounded-md hover:bg-orange-dark transition">
//                     Write a Review
//                 </button>
//             </div>

//             {/* Reviews */}
//             <div className="space-y-6">
//                 {reviews.map((review, idx) => (
//                     <div
//                         key={idx}
//                         className="bg-white rounded-xl shadow p-5 flex items-start gap-4"
//                     >
//                         <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
//                             <img
//                                 src={review?.userId?.profileImage?.url || "/profile-default.jpg"} // fallback
//                                 alt={review.userId.username}
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>


//                         {/* Review Content */}
//                         <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="font-semibold text-gray-900">{review.userId.username}</h3>
//                                 <span className="text-sm text-gray-500"><span>{formatTimeAgo(review.createdAt)}</span></span>
//                             </div>

//                             {/* Stars */}
//                             <div className="flex mt-1 mb-2">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                     <Star
//                                         key={star}
//                                         className={`w-5 h-5 ${star <= review.rating ? 'fill-orange text-orange' : 'text-gray-300'
//                                             }`}
//                                         fill={star <= review.rating ? 'currentColor' : 'none'}
//                                     />
//                                 ))}
//                             </div>

//                             <p className="text-gray-700">{review.comment}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//                 {paginationButtons}
//             </div>
//         </div>
//     );
// };

// export default ReviewPage;


import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Filter, Search } from 'lucide-react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import type { IReview, IRating } from '@/types/IReview';
import RatingSummary from './RatingSummary';
import ReadMore from '@/components/ReadMore';
import { handlePackageReview, handleAddReview, handleReviewRating } from '@/services/user/reviewService';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { formatTimeAgo } from '@/lib/utils/formatTime';
export default function ReviewPage() {



    const { packageId } = useParams()
    const navigate = useNavigate()
    const [reviews, setreviews] = useState<IReview[]>([]);
    const [ratingSummary, setRatingSummary] = useState<IRating>()
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState(1);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    useEffect(() => {
        if (!packageId) {
            return
        }
        const fetchReviews = async () => {
            try {
                const response = await handlePackageReview(packageId, currentPage, limit)
                const reviewRating = await handleReviewRating(packageId);
                console.log(reviewRating, 'review')
                setRatingSummary(reviewRating)
                console.log(response)
                setreviews(response.review)
                setTotalPages(response.pagination.totalPages);

            } catch (error) {
                console.log('failed to fetch review')
            }

        }
        fetchReviews()
    }, [searchParams])

    console.log(reviews, 'revies')
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



    const handleAddReview = () => {
        navigate(`/packages/${packageId}/review/add`);
    };

    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');


    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };



    //   const filteredReviews = reviews.filter(review => {
    //     const matchesFilter = filter === 'all' || review.rating.toString() === filter;
    //     const matchesSearch = review.packageId.title.includes(searchTerm.toLowerCase()) ||
    //                          review.comment.includes(searchTerm.toLowerCase()) ||
    //                          review?.userId?.username!.includes(searchTerm.toLowerCase());
    //     return matchesFilter && matchesSearch;
    //   });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Customer Reviews</h1>
                    <button onClick={handleAddReview} className="bg-orange text-white px-4 py-2 rounded-md hover:bg-orange-dark transition">
                        Write a Review
                    </button>
                </div>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
                    <p className="text-gray-600 text-lg">See what our customers are saying about their experience</p>
                </div>

                <div>
                    <RatingSummary summary={ratingSummary} />
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Reviews</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                            <div className="flex items-start gap-4">
                                <img
                                    src={review?.userId?.profileImage?.url || "/profile-default.jpg"}
                                    alt={review.userId.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />


                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-gray-900">{review.userId.username}</h3>
                                            {/* {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )} */}
                                        </div>
                                        <span className="text-sm text-gray-500"><span>{formatTimeAgo(review.createdAt)}</span></span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex gap-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                                    </div>

                                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

                                    <ReadMore text={review.comment} wordLimit={10} />
                                    <div className="flex items-center gap-4 text-sm text-gray-500">


                                        {/* <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button> */}
                                        {/* <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      Not helpful
                    </button> */}
                                        {/* <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    {paginationButtons}

                </div>
            </div>
        </div >
    );
}