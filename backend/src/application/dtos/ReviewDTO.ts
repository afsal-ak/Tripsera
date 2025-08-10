import { IReview } from '@domain/entities/IReview';
export interface CreateReviewDTO {
  userId: string;
  username: string;
  packageTitle: string;
  packageId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  title: string;
  comment?: string;
  isBlocked?: boolean;
}

export interface ReviewResponseDTO {
  _id: string;
  userId: string;
  packageId: string;
  username: string;
  packageTitle: string;
  rating: number;
  title: string;
  comment: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toReviewResponseDTO = (review: IReview): ReviewResponseDTO => {
  return {
    _id: review._id!.toString(),
    userId: review.userId as string,
    packageId: review.packageId as string,
    username: review.username,
    packageTitle: review.packageTitle,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    isBlocked: review.isBlocked ?? false,
    createdAt: review.createdAt!,
    updatedAt: review.updatedAt!,
  };
};
