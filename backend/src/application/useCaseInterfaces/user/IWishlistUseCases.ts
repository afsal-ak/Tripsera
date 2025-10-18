import { WishlistResponseDTO } from '@application/dtos/WishlistDTO';

export interface IWishlistUseCases {
  addToWishlist(userId: string, packageId: string): Promise<void>;

  removeFromWishList(userId: string, packageId: string): Promise<void>;

  checkPackageInWishlist(userId: string, packageId: string): Promise<boolean>;

  getUserWishlist(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    data: WishlistResponseDTO[];
    currentPage: number;
    totalPage: number;
    totalItems: number;
  }>;
}
