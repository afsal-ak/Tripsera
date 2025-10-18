import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleDeleteReview, handleReviewDetail } from '@/services/user/reviewService';
import type { IReview } from '@/types/IReview';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatTime';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

const ReviewDetail = () => {
  const user = useSelector((state: RootState) => state.userAuth.user);
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<IReview>();

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;
      try {
        const response = await handleReviewDetail(reviewId);
        console.log(response, 'res');
        setReview(response.review);
      } catch {
        toast.error('Failed to fetch review');
      }
    };
    fetchReview();
  }, []);

  const profileImage = user?.profileImage?.url || '/profile-default.jpg';
  console.log(profileImage, 'profile img');
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
  const handleEditForm = () => {
    navigate(`/account/my-reviews/${reviewId}/edit`);
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Delete Button */}
      <div className="flex justify-end gap-3">
        <ConfirmDialog title="Delete this review?" actionLabel="Delete" onConfirm={handleDelete}>
          <Button variant="destructive">Delete Review</Button>
        </ConfirmDialog>
        <Button onClick={handleEditForm} variant="destructive">
          Edit Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <div className="flex items-start gap-4">
            <img
              src={review?.userId?.profileImage?.url || '/profile-default.jpg'}
              alt={review?.userId?.username}
              className="w-12 h-12 rounded-full object-cover"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{review?.userId.username}</h3>
                </div>
                <span className="text-sm text-gray-500">
                  <span>{formatTimeAgo(review?.createdAt!)}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">{renderStars(review?.rating!)}</div>
                <span className="text-sm font-medium text-gray-700">{review?.rating!}.0</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{review?.packageTitle}</h4>

              <h4 className="font-semibold text-gray-900 mb-2">{review?.title}</h4>
              <p className="text-gray-700 leading-relaxed mb-4">{review?.comment}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
