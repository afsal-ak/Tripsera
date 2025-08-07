import { IBannerRepository } from '@domain/repositories/IBannerRepository';
import { IBanner } from '@domain/entities/IBanner';
import { IBannerManagementUseCases } from '@application/useCaseInterfaces/admin/IBannerManagementUseCases';
export class BannerMangementUseCases implements IBannerManagementUseCases {
  constructor(private bannerRepository: IBannerRepository) {}

  async createNewBanner(banner: IBanner): Promise<IBanner> {
    return await this.bannerRepository.createBanner(banner);
  }

  async getBanners(
    page: number,
    limit: number
  ): Promise<{
    banners: IBanner[];
    totalBanner: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [banners, totalBanner] = await Promise.all([
      this.bannerRepository.getAllBanners(skip, limit),
      this.bannerRepository.countDocument(),
    ]);

    return {
      banners,
      totalBanner,
      totalPages: Math.ceil(totalBanner / limit),
    };
  }

  async getActiveBanners(): Promise<IBanner[]> {
    return await this.bannerRepository.getAllActiveBanners();
  }

  async blockBanner(bannerId: string): Promise<void> {
    await this.bannerRepository.blockBanner(bannerId);
  }
  async unblockBanner(bannerId: string): Promise<void> {
    await this.bannerRepository.unblockBanner(bannerId);
  }

  async deleteBanner(bannerId: string): Promise<void> {
    await this.bannerRepository.deleteBanner(bannerId);
  }
}
