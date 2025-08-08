export interface CreateReviewDTO {
  userId: string;
  packageId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
  isBlocked?: boolean;
}

//  export interface IReview {
//   _id: string;
//   userId: string;
//   packageId: string;
//   rating: number;
//   comment: string;
//   isBlocked: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }
export interface IReview {
  _id: string;
  userId: {
    username?: string
    email?: string;
    profileImage?: { url: string }
  };
  username?: string;
  profileImage?: { url: string };
  packageId: {
    title: string;
  };
  title: string;
  rating: number;
  comment: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface IRating {
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  oneStar: number;
  threeStar: number;
  totalReviews: number;
  twoStar: number;
}