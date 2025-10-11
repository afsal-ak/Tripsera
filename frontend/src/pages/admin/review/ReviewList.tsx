import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleFetchReview } from '@/services/admin/reviewService';
import type { IReview } from '@/types/IReview';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { Star } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTime';

import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { FilterBar } from '@/components/FilterBar ';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { useDebounce } from 'use-debounce';
import { useCleanFilter } from '@/hooks/useCleanFilter ';
const ReviewList = () => {

  const navigate = useNavigate()
  const [reviews, setreviews] = useState<IReview[]>([]);
  const [searchParams, setSearchParams] = useSearchParams()
  const [totalPages, setTotalPages] = useState(1);
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
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

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const cleanFilter = useCleanFilter()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const rawFilters = {
          search: debouncedSearch,
          status: statusFilter,
          sort,
          startDate,
          endDate,
          rating
        };

        // Remove any empty, null, or undefined filter fields to avoid sending unnecessary query parameters
        const filters = cleanFilter(rawFilters);

        const response = await handleFetchReview(currentPage, limit, filters);
        console.log(response.data,'review response in list');
                console.log(response.pagination,'review response in list');

        setreviews(response.data);
        setTotalPages(response.pagination.totalPages);
        //    console.log(response.pagination,'pagination')
      } catch (error) {
        console.log('failed to fetch review');
      }
    };
    fetchReviews();
  }, [debouncedSearch, searchParams, currentPage]);

  console.log(reviews, 'revies')
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
  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });




  // Handlers passed to FilterBar
  const handleSearchChange = (val: string) => setSearchQuery(val);
  const handleStatusChange = (val: string) => setStatusFilter(val);
  const handleSortChange = (val: string) => setSort(val);
  const handleRatingChange = (val: string) => setRating(val);

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setSort("");
    setRating('')
    setSearchParams({ page: "1" }); // reset to page 1
  };

  const handleClick = (reviewId: string) => {
    navigate(`/admin/reviews/${reviewId}`)
  }

  return (


    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>


        <FilterBar
          searchValue={searchQuery}
          statusValue={statusFilter}
          startDateValue={startDate}
          endDateValue={endDate}
          sortValue={sort}
          ratingValue={rating}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSortChange={handleSortChange}
          onRatingChange={handleRatingChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          statusOptions={[
            { value: "active", label: "Active" },
            { value: "blocked", label: "Blocked" },
          ]}
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review, index) => (
              <TableRow key={review._id}>
                <TableCell>{(currentPage - 1) * 5 + index + 1}</TableCell>
                <TableCell>{review.username}</TableCell>
                <TableCell>{review?.packageTitle}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>
                  {/* {review.comment.split(/\s+/).length > 10
                    ? review.comment.split(/\s+/).slice(0, 10).join(" ") + "..."
                    : review.comment} */}
                    {review.title}
                </TableCell>
                <TableCell>
                  {review.isBlocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                {/* <TableCell className="flex gap-2">
                  {review.isBlocked ? (
                    <ConfirmDialog
                      title="Unblock this user?"
                      actionLabel="Unblock"
                      onConfirm={() => handleToggleBlock(review._id!, false)}
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
                      title="Block this user?"
                      actionLabel="Block"
                      onConfirm={() => handleToggleBlock(review._id!, true)}
                    >
                      <Button size="sm" variant="destructive">
                        Block
                      </Button>
                    </ConfirmDialog>
                  )}
                </TableCell> */}
                <Button
                  className="mt-5 text-center"

                  onClick={() => handleClick(review._id)}
                  variant="outline"
                  size="sm"
                >
                  View Details
                </Button>
              </TableRow>
            ))}
          </TableBody>

        </Table>
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          {paginationButtons}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewList;
