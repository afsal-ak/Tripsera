import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { handlePackageReview } from '@/features/services/user/reviewService';
import type { IReview } from '@/features/types/IReview';
import { usePaginationButtons } from '@/features/hooks/usePaginationButtons';
import { Star } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTime';

const ReviewPage = () => {

    const { packageId } = useParams()
    const navigate = useNavigate()
    const [reviews, setreviews] = useState<IReview[]>([]);
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
                const response = await handlePackageReview(packageId,currentPage,limit)
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


    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Customer Reviews</h1>
                <button onClick={handleAddReview} className="bg-orange text-white px-4 py-2 rounded-md hover:bg-orange-dark transition">
                    Write a Review
                </button>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
                {reviews.map((review, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow p-5 flex items-start gap-4"
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <img
                                src={review?.userId?.profileImage?.url || "/profile-default.jpg"} // fallback
                                alt={review.userId.username}
                                className="w-full h-full object-cover"
                            />
                        </div>


                        {/* Review Content */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{review.userId.username}</h3>
                                <span className="text-sm text-gray-500"><span>{formatTimeAgo(review.createdAt)}</span></span>
                            </div>

                            {/* Stars */}
                            <div className="flex mt-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= review.rating ? 'fill-orange text-orange' : 'text-gray-300'
                                            }`}
                                        fill={star <= review.rating ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                {paginationButtons}
            </div>
        </div>
    );
};

export default ReviewPage;
