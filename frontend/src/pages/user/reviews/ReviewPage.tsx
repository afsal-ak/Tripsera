
import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle, Filter, Search } from 'lucide-react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import type { IReview, IRating } from '@/types/IReview';
import RatingSummary from './RatingSummary';
import ReadMore from '@/components/ReadMore';
import { handlePackageReview, handleAddReview, handleReviewRating } from '@/services/user/reviewService';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { formatTimeAgo } from '@/lib/utils/formatTime';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { FilterBar } from '@/components/FilterBar ';
import { useDebounce } from 'use-debounce';
import { useCleanFilter } from '@/hooks/useCleanFilter ';
import ReportForm from '../report/ReportForm';
import { Button } from '@/components/ui/button';
import type { ISelectedReport } from '@/types/IReport';
import Modal from '@/components/ui/Model';


export default function ReviewPage() {

    const { packageId } = useParams()
    const navigate = useNavigate()
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [ratingSummary, setRatingSummary] = useState<IRating>()
    const [selectedReport, setSelectedReport] = useState<ISelectedReport | null>(null);

    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState(1);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const {
        searchQuery,
        setSearchQuery,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        sort,
        rating,
        setRating,
        setSort,
        applyFilters,
    } = useSearchFilters();
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const cleanFilter = useCleanFilter()

    useEffect(() => {
        if (!packageId) {
            return
        }
        const fetchReviews = async () => {
            try {
                const rawFilters = {
                    search: debouncedSearch,
                    sort,
                    startDate,
                    endDate,
                    rating
                };

                // Remove any empty, null, or undefined filter fields to avoid sending unnecessary query parameters
                const filters = cleanFilter(rawFilters);
                const response = await handlePackageReview(packageId, currentPage, limit, filters)
                const reviewRating = await handleReviewRating(packageId);
                // console.log(reviewRating, 'review')
                setRatingSummary(reviewRating)
                 console.log(response,'ll')
                setReviews(response.data)
                setTotalPages(response.pagination.totalPages);

            } catch (error) {
                console.log('failed to fetch review')
            }

        }
        fetchReviews()
    }, [debouncedSearch, searchParams, currentPage]);
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        }
        else params.delete('search');
        params.set('page', '1');
        setSearchParams(params);
    }, [debouncedSearch]);

    const handlePageChange = (page: number) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', page.toString());
            return newParams;
        });
    };
    console.log(reviews, 'reavew page')

    const paginationButtons = usePaginationButtons({
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
    });


    // Handlers passed to FilterBar
    const handleSearchChange = (val: string) => setSearchQuery(val);
    const handleSortChange = (val: string) => setSort(val);
    const handleRatingChange = (val: string) => setRating(val);

    const handleApplyFilters = () => {
        applyFilters();
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setStartDate("");
        setEndDate("");
        setSort("");
        setRating('')
        setSearchParams({ page: "1" }); // reset to page 1
    };


    const handleAddReview = () => {
        navigate(`/packages/${packageId}/review/add`);
    };



    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

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
                            <FilterBar
                                searchValue={searchQuery}
                                startDateValue={startDate}
                                endDateValue={endDate}
                                sortValue={sort}
                                ratingValue={rating}
                                onSearchChange={handleSearchChange}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                                onSortChange={handleSortChange}
                                onRatingChange={handleRatingChange}
                                onApply={handleApplyFilters}
                                onClear={handleClearFilters}

                                sortOptions={[
                                    { value: "asc", label: "Newest" },
                                    { value: "desc", label: "Oldest" },
                                    { value: "rating_highest", label: "Highest Rating" },
                                    { value: "rating_lowest", label: "Lowest Rating" },
                                ]}
                                ratingOptions={[
                                    { value: "1", label: "1 Star" },
                                    { value: "2", label: "2 Star" },
                                    { value: "3", label: "3 Star" },
                                    { value: "4", label: "4 Star" },
                                    { value: "5", label: "5 Star" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                        >
                            <div className="flex items-start gap-4">
                                <img
                                    src={review?.userId?.profileImage?.url || "/profile-default.jpg"}
                                    alt={review.userId.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-gray-900">
                                                {review.userId.username}
                                            </h3>


                                            <button
                                                onClick={() =>
                                                    setSelectedReport({ _id: review._id, reportedType: 'review' })
                                                } aria-label="Report this content"
                                                className="inline-flex items-center gap-1 text-red-600 hover:text-yellow-800 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                Report
                                            </button>
                                        </div>

                                        <span className="text-sm text-gray-500">
                                            {formatTimeAgo(review.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex gap-1">{renderStars(review.rating)}</div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {review.rating}.0
                                        </span>
                                    </div>

                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        {review.title}
                                    </h4>

                                    <ReadMore text={review.comment} wordLimit={10} />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Modal for Report Form */}
                    {selectedReport && (
                        <Modal onClose={() => setSelectedReport(null)}>
                            <ReportForm
                                status="review"
                                id={selectedReport._id}
                                onSuccess={() => setSelectedReport(null)}
                            />

                        </Modal>
                    )}
                </div>

                <div className="text-center mt-8">
                    {paginationButtons}

                </div>
            </div>
        </div >
    );
}