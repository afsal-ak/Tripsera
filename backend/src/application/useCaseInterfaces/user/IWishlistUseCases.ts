import { IWishlist } from '@domain/entities/IWishlist';

export interface IWishlistUseCases {
  addToWishlist(userId: string, packageId: string): Promise<void>;

  removeFromWishList(userId: string, packageId: string): Promise<void>;

  checkPackageInWishlist(userId: string, packageId: string): Promise<boolean>;

  getUserWishlist(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    data: IWishlist[];
    currentPage: number;
    totalPage: number;
    totalItems: number;
  }>;
}
