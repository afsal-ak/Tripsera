import { CreatePackageDTO,PackageResponseDTO,EditPackageDTO, PackageTableResponseDTO  } from '@application/dtos/PackageDTO';
import { IFilter } from '@domain/entities/IFilter';
 import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
 
export interface IPackageUseCases {
  // getAllPackages(
  //   page: number,
  //   limit: number,
  //   filters?:IFilter
  // ): Promise<{
  //   packages: PackageTableResponseDTO[];
  //   totalPackages: number;
  //   totalPages: number;
  // }>;
 getAllPackages(
    page: number,
    limit: number,
    filters?:IFilter
  ): Promise<IPaginatedResult<PackageTableResponseDTO>> 
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
