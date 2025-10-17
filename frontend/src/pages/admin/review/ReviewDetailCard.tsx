 import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatTimeAgo } from "@/lib/utils/formatTime";import { Star } from "lucide-react";
 import type { IReview } from "@/types/IReview";
interface ReviewDetailsProps {
  reviewData: IReview;
  onDelete: () => void;
  onToggleBlock: (id: string, newStatus: boolean) => void;
}

 const ReviewDetailCard=({ reviewData, onDelete, onToggleBlock }: ReviewDetailsProps) =>{
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {/* Header and Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Review Details</h2>
        <div className="flex gap-4">
          <ConfirmDialog title="Delete this review?" actionLabel="Delete" onConfirm={onDelete}>
            <Button variant="destructive">Delete Review</Button>
          </ConfirmDialog>

          <ConfirmDialog
            title="Change this review status?"
            actionLabel={reviewData?.isBlocked ? "Unblock" : "Block"}
            onConfirm={() => {
              if (!reviewData?._id) return;
              onToggleBlock(reviewData._id, !reviewData.isBlocked);
            }}
          >
            <Button>{reviewData?.isBlocked ? "Unblock" : "Block"}</Button>
          </ConfirmDialog>
        </div>
      </div>

      {/* Review Card */}
      <div className="bg-gray-50 p-6 rounded-md shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            User: {reviewData?.userId?.username}
          </h3>
          <span className="text-sm text-gray-500">
            Published: {formatTimeAgo(reviewData?.createdAt!)}
          </span>
        </div>

        {/* User Email */}
        <p className="text-gray-500">Email: {reviewData?.userId?.email}</p>

        {/* Package Details */}
        <h4 className="font-semibold text-gray-900">
          Package: {reviewData?.packageId?.title}
        </h4>

        {/* Star Rating */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= reviewData?.rating! ? "fill-orange text-orange" : "text-gray-300"
              }`}
              fill={star <= reviewData?.rating! ? "currentColor" : "none"}
            />
          ))}
        </div>

        <p className="text-gray-700">{reviewData?.title}</p>

        {/* Review Comment */}
        <p className="text-gray-700">{reviewData?.comment}</p>
      </div>
    </div>
  );
}

export default ReviewDetailCard