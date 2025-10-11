import { IReview } from "@domain/entities/IReview";
 
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
export interface ReviewTableDTO {
  _id: string;
  username: string;
  packageTitle: string;
  rating: number;
  title: string;
  isBlocked: boolean;
  createdAt: Date;
}

export interface UserReviewListDTO {
  _id: string;
  packageTitle: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
}

export abstract class ReviewMapper {
  // Full detailed DTO (admin / detail view)
  static toResponseDTO(review: IReview): ReviewResponseDTO {
    return {
      _id: review._id?.toString() ?? "",
      userId: review.userId.toString(),
      packageId: review.packageId.toString(),
      username: review.username,
      packageTitle: review.packageTitle,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isBlocked: review.isBlocked ?? false,
      createdAt: review.createdAt!,
      updatedAt: review.updatedAt!,
    };
  }

  // For admin table (list view)
  static toTableDTO(review: IReview): ReviewTableDTO {
    return {
      _id: review._id?.toString() ?? "",
      username: review.username,
      packageTitle: review.packageTitle,
      rating: review.rating,
      title: review.title,
      isBlocked: review.isBlocked ?? false,
      createdAt: review.createdAt!,
    };
  }

  // For user’s "My Reviews" list
  static toUserListDTO(review: IReview): UserReviewListDTO {
    return {
      _id: review._id?.toString() ?? "",
      packageTitle: review.packageTitle,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      createdAt: review.createdAt!,
    };
  }
}
