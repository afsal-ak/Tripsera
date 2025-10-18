import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  handleDeleteReview,
  handleChangeStatus,
  handleReviewDetail,
} from '@/services/admin/reviewService';
import type { IReview } from '@/types/IReview';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTime';
import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<IReview>();

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;
      try {
        const response = await handleReviewDetail(reviewId);
        setReview(response.review);
      } catch {
        toast.error('Failed to fetch review');
      }
    };
    fetchReview();
  }, []);

  const handleDelete = async () => {
    if (!reviewId) return;
    try {
      const response = await handleDeleteReview(reviewId);
      toast.success(response.message);
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete');
    }
  };

  const handleBlockToggle = async (reviewId: string, currentBlocked: boolean) => {
    try {
      await handleChangeStatus(reviewId, !currentBlocked);
      toast.success(`Review has been ${!currentBlocked ? 'blocked' : 'unblocked'}`);
      navigate('/admin/reviews');
    } catch (error) {
      toast.error('Failed to change review status');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Header and Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Review Details</h2>
        <div className="flex gap-4">
          <ConfirmDialog title="Delete this review?" actionLabel="Delete" onConfirm={handleDelete}>
            <Button variant="destructive">Delete Review</Button>
          </ConfirmDialog>
          <ConfirmDialog
            title="Change this review status?"
            actionLabel={review?.isBlocked ? 'Unblock' : 'Block'}
            onConfirm={() => handleBlockToggle(review?._id!, review?.isBlocked!)}
          >
            <Button>{review?.isBlocked ? 'Unblock' : 'Block'}</Button>
          </ConfirmDialog>
        </div>
      </div>

      {/* Review Card */}
      <div className="bg-gray-50 p-6 rounded-md shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">User: {review?.userId?.username}</h3>
          <span className="text-sm text-gray-500">
            Published: {formatTimeAgo(review?.createdAt!)}
          </span>
        </div>

        {/* User Email */}
        <p className="text-gray-500">Email: {review?.userId?.email}</p>

        {/* Package Details */}
        <h4 className="font-semibold text-gray-900">Package: {review?.packageId?.title}</h4>

        {/* Star Rating */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${star <= review?.rating! ? 'fill-orange text-orange' : 'text-gray-300'}`}
              fill={star <= review?.rating! ? 'currentColor' : 'none'}
            />
          ))}
        </div>

        {/* Review Comment */}
        <p className="text-gray-700">{review?.comment}</p>
      </div>
    </div>
  );
};

export default ReviewDetail;
