import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { IFilter } from '@domain/entities/IFilter';
import {
  UpdateCustomPkgStatusDTO,
  CustomPkgResponseDTO,
  CustomPkgTableDTO,
  AdminCreateCustomPackageDTO,
  AdminEditCustomPackageDTO,
  CustomPackageApprovedResponseDTO
} from '@application/dtos/CustomPkgDTO';
import { PackageResponseDTO } from '@application/dtos/PackageDTO';

export interface ICustomPkgUseCases {
  changeCustomPkgStatus(
    customPkgId: string,
    data: UpdateCustomPkgStatusDTO
  ): Promise<CustomPkgResponseDTO | null>;
  deleteCustomPkg(customPkgId: string): Promise<boolean>;
  getAllRequestedCustomPkg(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPkgTableDTO>>;
  getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null>;

  createCustomPackage(pkg: AdminCreateCustomPackageDTO): Promise<PackageResponseDTO>
  getApprovedCustomPackage(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPackageApprovedResponseDTO>>
  editCustomPackageData(
    id: string,
    data: AdminEditCustomPackageDTO,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<void>;

}
