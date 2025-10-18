import React, { useState } from 'react';
import { handleAddReview } from '@/services/user/reviewService';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewForm = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const [errors, setErrors] = useState<{ rating?: string; title?: string; comment?: string }>({});

  const validate = () => {
    const newErrors: { rating?: string; title?: string; comment?: string } = {};
    if (rating === 0) {
      newErrors.rating = 'Please select a rating.';
    }
    if (title.trim().length < 3) {
      newErrors.title = 'Title should be at least 3 characters long.';
    }
    if (comment.trim().length < 4) {
      newErrors.comment = 'Review should be at least 4 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !packageId) {
      return;
    }

    setLoading(true);

    try {
      const response = await handleAddReview(packageId, rating, title, comment);
      navigate(-1);
      toast.success('Review submitted successfully!');
      setTitle('');
      setComment('');
      setRating(0);
      setHovered(0);
      setErrors({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Review</h2>

      {/* Rating */}
      <div className="mb-2">
        <div className="flex justify-center items-center mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setErrors((prev) => ({ ...prev, rating: undefined }));
              }}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hovered || rating) ? 'fill-orange text-orange' : 'text-gray-300'
                }`}
                fill={star <= (hovered || rating) ? 'currentColor' : 'none'}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim().length >= 4) {
                setErrors((prev) => ({ ...prev, title: undefined }));
              }
            }}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Title..."
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>
        <div className="mb-2">
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (e.target.value.trim().length >= 4) {
                setErrors((prev) => ({ ...prev, comment: undefined }));
              }
            }}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your review here..."
          />
          {errors.comment && <p className="text-sm text-red-500 mt-1">{errors.comment}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-orange text-white py-2 px-4 rounded-lg hover:bg-orange-dark transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
