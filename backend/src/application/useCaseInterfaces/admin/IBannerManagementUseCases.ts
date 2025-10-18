import { CreateBannerDTO, BannerResponseDTO } from '@application/dtos/BannerDTO';

export interface IBannerManagementUseCases {
  createNewBanner(banner: CreateBannerDTO): Promise<BannerResponseDTO>;

  getBanners(
    page: number,
    limit: number
  ): Promise<{
    banners: BannerResponseDTO[];
    totalBanner: number;
    totalPages: number;
  }>;

  getActiveBanners(): Promise<BannerResponseDTO[]>;

  blockBanner(bannerId: string): Promise<void>;

  unblockBanner(bannerId: string): Promise<void>;

  deleteBanner(bannerId: string): Promise<void>;
}
