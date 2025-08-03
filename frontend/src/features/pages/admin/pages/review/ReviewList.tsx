import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { handleFetchReview } from '@/features/services/admin/reviewService';
import type { IReview } from '@/features/types/IReview';
import { usePaginationButtons } from '@/features/hooks/usePaginationButtons';
import { Star } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTime';

import { Button } from '@/features/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/features/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/components/ui/Table';
import { ConfirmDialog } from '@/features/components/ui/ConfirmDialog';

const ReviewList = () => {

     const navigate = useNavigate()
    const [reviews, setreviews] = useState<IReview[]>([]);
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState(1);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    useEffect(() => {
        
        const fetchReviews = async () => {
            try {
                const response = await handleFetchReview(currentPage,limit)
                console.log(response)
                setreviews(response.reviews)
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

    const handleClick=(reviewId:string)=>{
      navigate(`/admin/reviews/${reviewId}`)
    }
 
    return (
   

          <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review, index) => (
              <TableRow key={review._id}>
                <TableCell>{(currentPage - 1) * 5 + index + 1}</TableCell>
                <TableCell>{review.userId?.username}</TableCell>
                <TableCell>{review.packageId?.title}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
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
