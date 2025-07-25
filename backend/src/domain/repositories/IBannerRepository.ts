import { IBanner } from '@domain/entities/IBanner';

export interface IBannerRepository {
  createBanner(banner: IBanner): Promise<IBanner>;
  getAllBanners(page: number, limit: number): Promise<IBanner[]>;
  countDocument(): Promise<number>;
  getAllActiveBanners(): Promise<IBanner[]>;
  deleteBanner(id: string): Promise<void>;
  blockBanner(id: string): Promise<void>;
  unblockBanner(id: string): Promise<void>;
}
