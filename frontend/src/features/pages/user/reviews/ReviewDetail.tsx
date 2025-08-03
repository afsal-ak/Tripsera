import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { handleDeleteReview, handleReviewDetail } from '@/features/services/user/reviewService'
import type { IReview } from '@/features/types/IReview'
import { toast } from 'sonner'
import { Star } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils/formatTime'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { Button } from '@/features/components/Button'
import { ConfirmDialog } from '@/features/components/ui/ConfirmDialog'

const ReviewDetail = () => {
  const user = useSelector((state: RootState) => state.userAuth.user)
  const { reviewId } = useParams()
  const navigate = useNavigate()
  const [review, setReview] = useState<IReview>()

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return
      try {
        const response = await handleReviewDetail(reviewId)
        setReview(response.review)
      } catch {
        toast.error('Failed to fetch review')
      }
    }
    fetchReview()
  }, [])

  const profileImage = review?.userId.profileImage?.url || '/profile-default.jpg'
console.log(profileImage,'profile img')
  const handleDelete = async () => {
    if (!reviewId) return
    try {
      const response = await handleDeleteReview(reviewId)
      toast.success(response.message)
      navigate(-1)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Delete Button */}
      <div className="flex justify-end">
        <ConfirmDialog title="Delete this review?" actionLabel="Delete" onConfirm={handleDelete}>
          <Button variant="destructive">Delete Review</Button>
        </ConfirmDialog>
      </div>

      {/* Review Card */}
      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
          <img src={profileImage} alt={review?.userId.username} className="w-full h-full object-cover" />
        </div>

        {/* Review Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{user?.username}</h3>
            <span className="text-sm text-gray-500">{formatTimeAgo(review?.createdAt!)}</span>
          </div>

          {/* Star Rating */}
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= review?.rating! ? 'fill-orange text-orange' : 'text-gray-300'}`}
                fill={star <= review?.rating! ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          <p className="text-gray-700">{review?.comment}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetail
