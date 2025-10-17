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

 