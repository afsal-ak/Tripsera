import { IBannerRepository } from '@domain/repositories/IBannerRepository';
import { IBanner } from '@domain/entities/IBanner';
import { IPackageQueryOptions } from '@domain/entities/IPackageQueryOptions';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IPackage } from '@domain/entities/IPackage';
import { IHomeUseCases } from '@application/useCaseInterfaces/user/IHomeUseCases';

export class HomeUseCases implements IHomeUseCases {
  constructor(
    private _packageRepo: IPackageRepository,
    private _bannerRepo: IBannerRepository
  ) {}

  async getHome(): Promise<{ banners: IBanner[]; packages: IPackage[] }> {
    const banners = await this._bannerRepo.getAllActiveBanners();
    const packages = await this._packageRepo.getHomeData();
    return { banners, packages };
  }

  async getActivePackage(options: IPackageQueryOptions): Promise<{
    data: IPackage[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { filters = {}, page = 1, limit = 8, sort = 'newest', search = '' } = options;

    const today = new Date();
    const mongoFilter: any = {
      isBlocked: false,
      endDate: { $gte: today },
    };

    // Apply search
    if (search) {
      mongoFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (filters.category) {
      console.log(filters.category, 'category');
      mongoFilter.category = filters.category;
    }

    if (filters.duration) {
      const durationValue = filters.duration;

      if (!isNaN(Number(durationValue))) {
        mongoFilter.duration = Number(durationValue);
      }
    }
    if (filters.startDate || filters.endDate) {
      mongoFilter.startDate = {};

      if (filters.startDate) {
        mongoFilter.startDate.$gte = new Date(filters.startDate as string);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate as string);
        end.setHours(23, 59, 59, 999);
        mongoFilter.startDate.$lte = end;
      }
    }

    const sortOptions: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const skip = (page - 1) * limit;
    const sortBy = sortOptions[sort] || sortOptions['newest'];

    const [packages, total] = await Promise.all([
      this._packageRepo.getActivePackages(mongoFilter, skip, limit, sortBy),
      this._packageRepo.countActivePackages(mongoFilter),
    ]);

    return {
      data: packages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getPackageById(id: string): Promise<IPackage | null> {
    const pkg = await this._packageRepo.findById(id);
    return pkg;
  }
}
