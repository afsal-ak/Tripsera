import { CreatePackageDTO,PackageResponseDTO,EditPackageDTO, PackageTableResponseDTO  } from '@application/dtos/PackageDTO';
import { IPackage } from '@domain/entities/IPackage';

export interface IPackageUseCases {
  getAllPackages(
    page: number,
    limit: number
  ): Promise<{
    packages: PackageTableResponseDTO[];
    totalPackages: number;
    totalPages: number;
  }>;

  getSinglePackage(id: string): Promise<PackageResponseDTO | null>;

  createPackage(pkg: CreatePackageDTO): Promise<PackageResponseDTO>;

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
