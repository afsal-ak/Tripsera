import { IBannerRepository } from '@domain/repositories/IBannerRepository';
import { IPackageQueryOptions } from '@domain/entities/IPackageQueryOptions';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IHomeUseCases } from '@application/useCaseInterfaces/user/IHomeUseCases';
import { PackageResponseDTO } from '@application/dtos/PackageDTO';
import { PackageMapper } from '@application/mappers/PackageMapper';
import { BannerResponseDTO } from '@application/dtos/BannerDTO';
import { BannerMapper } from '@application/mappers/BannerMapper';
import { log } from 'node:console';
import { IPackageFilter } from '@domain/entities/IPackageFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';

export class HomeUseCases implements IHomeUseCases {
  constructor(
    private _packageRepo: IPackageRepository,
    private _bannerRepo: IBannerRepository
  ) {}

  async getHome(): Promise<{ banners: BannerResponseDTO[]; packages: PackageResponseDTO[] }> {
    const banners = await this._bannerRepo.getAllActiveBanners();
    const packages = await this._packageRepo.getHomeData();
    return {
      banners: banners.map(BannerMapper.toResponseDTO),
      packages: packages.map(PackageMapper.toResponseDTO),
    };
  }
async getActivePackage(page: number, limit: number, filter?: IPackageFilter): Promise<IPaginatedResult<PackageResponseDTO>> {
    const result = await this._packageRepo.getActivePackages(page,limit,filter);
    return{
      data:result.package.map(PackageMapper.toResponseDTO),
      pagination:result.pagination
    }

}
  async getPackageById(id: string): Promise<PackageResponseDTO | null> {
    const pkg = await this._packageRepo.findById(id);
    return PackageMapper.toResponseDTO(pkg!);
  }
}
