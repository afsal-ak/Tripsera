import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface Review {
  _id: string;
  username: string;
  content: string;
  rating: number;
  profileImage?: { url: string };
}

interface Props {
  reviews: Review[];
}

const ReviewSection = ({ reviews }: Props) => {
  return (
    <section className="bg-white rounded-xl p-8 shadow-sm border">
      <h2 className="text-2xl font-bold text-foreground mb-6">What Travelers Say</h2>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review._id} className="border shadow-sm">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-orange text-white font-bold flex items-center justify-center overflow-hidden">
                  {review.profileImage?.url ? (
                    <img
                      src={review.profileImage.url}
                      alt={review.username}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => (e.currentTarget.src = '/fallback.jpg')}
                    />
                  ) : (
                    review.username[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{review.username}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-orange fill-current mr-1" />
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-2">{review.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
