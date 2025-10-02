import { PackageResponseDTO } from '@application/dtos/PackageDTO';
import { IBanner } from '@domain/entities/IBanner';
import { IPackage } from '@domain/entities/IPackage';
import { IPackageQueryOptions } from '@domain/entities/IPackageQueryOptions';

export interface IHomeUseCases {
  getHome(): Promise<{
    banners: IBanner[];
    packages: IPackage[];
  }>;

  getActivePackage(options: IPackageQueryOptions): Promise<{
    data: IPackage[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>;

  getPackageById(id: string): Promise<PackageResponseDTO | null>;
}
