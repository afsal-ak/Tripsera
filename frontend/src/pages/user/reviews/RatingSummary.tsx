import React from 'react';

export interface IRating {
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  totalReviews: number;
}

interface RatingSummaryProps {
  summary?: IRating;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ summary }) => {
  const starMap: Record<number, number> = {
    5: summary?.fiveStar || 0,
    4: summary?.fourStar || 0,
    3: summary?.threeStar || 0,
    2: summary?.twoStar || 0,
    1: summary?.oneStar || 0,
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left side: Average */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {summary?.averageRating?.toFixed(1) || '0.0'}
          </div>
          <p className="text-gray-600">Based on {summary?.totalReviews || 0} reviews</p>
        </div>

        {/* Right side: Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starMap[star];
            const percentage = summary?.totalReviews ? (count / summary.totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
