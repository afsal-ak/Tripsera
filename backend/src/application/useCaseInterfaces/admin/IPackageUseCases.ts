import { CreatePackageDTO,PackageResponseDTO,EditPackageDTO  } from '@application/dtos/PackageDTO';
import { IPackage } from '@domain/entities/IPackage';

export interface IPackageUseCases {
  getAllPackages(
    page: number,
    limit: number
  ): Promise<{
    packages: IPackage[];
    totalPackages: number;
    totalPages: number;
  }>;

  getSinglePackage(id: string): Promise<PackageResponseDTO | null>;

  createPackage(pkg: IPackage): Promise<IPackage>;

  editPackageData(
    id: string,
    data: EditPackageDTO,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<void>;

  block(id: string): Promise<void>;

  unblock(id: string): Promise<void>;

  delete(id: string): Promise<void>;
}
