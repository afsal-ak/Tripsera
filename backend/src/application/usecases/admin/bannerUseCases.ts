import { IBannerRepository } from '@domain/repositories/IBannerRepository';
import { IBanner } from '@domain/entities/IBanner';
import { IBannerManagementUseCases } from '@application/useCaseInterfaces/admin/IBannerManagementUseCases';
import { CreateBannerDTO, BannerResponseDTO } from '@application/dtos/BannerDTO';
import { BannerMapper } from '@application/mappers/BannerMapper';


export class BannerMangementUseCases implements IBannerManagementUseCases {

  constructor(private _bannerRepository: IBannerRepository) { }

  async createNewBanner(bannerData: CreateBannerDTO): Promise<BannerResponseDTO> {
    const newBanner = await this._bannerRepository.createBanner(bannerData);
    return BannerMapper.toResponseDTO(newBanner);
  }

  async getBanners(
    page: number,
    limit: number
  ): Promise<{
    banners: BannerResponseDTO[];
    totalBanner: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [banners, totalBanner] = await Promise.all([
      this._bannerRepository.getAllBanners(skip, limit),
      this._bannerRepository.countDocument(),
    ]);

    return {
      banners: banners.map(BannerMapper.toResponseDTO),
      totalBanner,
      totalPages: Math.ceil(totalBanner / limit),
    };
  }

  async getActiveBanners(): Promise<BannerResponseDTO[]> {
    const banner = await this._bannerRepository.getAllActiveBanners();
    return banner.map(BannerMapper.toResponseDTO);
  }

  async blockBanner(bannerId: string): Promise<void> {
    await this._bannerRepository.blockBanner(bannerId);
  }
  async unblockBanner(bannerId: string): Promise<void> {
    await this._bannerRepository.unblockBanner(bannerId);
  }

  async deleteBanner(bannerId: string): Promise<void> {
    await this._bannerRepository.deleteBanner(bannerId);
  }
}
