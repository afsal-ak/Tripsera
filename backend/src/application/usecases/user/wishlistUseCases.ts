import { IWishlist } from '@domain/entities/IWishlist';
 import { IWishlistRepository } from '@domain/repositories/IWishlistRepository';
import { IWishlistUseCases } from '@application/useCaseInterfaces/user/IWishlistUseCases';

export class WishlistUseCases implements IWishlistUseCases {
  constructor(private wishlistRepo: IWishlistRepository) {}

  async addToWishlist(userId: string, packageId: string): Promise<void> {
    return await this.wishlistRepo.addToWishlist(userId, packageId);
  }

  async removeFromWishList(userId: string, packageId: string): Promise<void> {
    return await this.wishlistRepo.removeFromWishlist(userId, packageId);
  }

  async checkPackageInWishlist(userId: string, packageId: string) {
    return await this.wishlistRepo.checkPackageInWishlist(userId, packageId);
  }

  async getUserWishlist(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    data: IWishlist[];
    currentPage: number;
    totalPage: number;
    totalItems: number;
  }> {
    const [data, totalItems] = await Promise.all([
      this.wishlistRepo.getUserWishlist(userId, page, limit),
      this.wishlistRepo.countUserWishlist(userId),
    ]);

    const totalPage = Math.ceil(totalItems / limit);
    return {
      data,
      currentPage: page,
      totalPage,
      totalItems,
    };
  }
}
