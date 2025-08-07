import { IBanner } from '@domain/entities/IBanner';

export interface IBannerManagementUseCases {
  createNewBanner(banner: IBanner): Promise<IBanner>;

  getBanners(
    page: number,
    limit: number
  ): Promise<{
    banners: IBanner[];
    totalBanner: number;
    totalPages: number;
  }>;

  getActiveBanners(): Promise<IBanner[]>;

  blockBanner(bannerId: string): Promise<void>;

  unblockBanner(bannerId: string): Promise<void>;

  deleteBanner(bannerId: string): Promise<void>;
}
