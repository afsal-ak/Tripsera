import { IReview } from "@domain/entities/IReview";  
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

 export interface ReviewResponseDTO {
  _id: string;
  userId: string;
  packageId: string;
  rating: number;
  comment: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toReviewResponseDTO = (review: IReview): ReviewResponseDTO => {
  return {
    _id: review._id!.toString(),
    userId: review.userId.toString(),
    packageId: review.packageId.toString(),
    rating: review.rating,
    comment: review.comment,
    isBlocked: review.isBlocked ?? false,
    createdAt: review.createdAt!,
    updatedAt: review.updatedAt!,
  };
};
