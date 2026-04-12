import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { IFilter } from '@domain/entities/IFilter';
import {
  UpdateCustomPkgStatusDTO,
  CustomPkgResponseDTO,
  CustomPkgTableDTO,
  AdminCreateCustomPackageDTO,
  AdminEditCustomPackageDTO,
  CustomPackageApprovedResponseDTO,
  CompanyCreateCustomPackageDTO,
  CompanyEditCustomPackageDTO
} from '@application/dtos/CustomPkgDTO';
import { PackageResponseDTO } from '@application/dtos/PackageDTO';

export interface ICustomPkgUseCases {
  changeCustomPkgStatus(
    companyId:string,
    customPkgId: string,
    data: UpdateCustomPkgStatusDTO
  ): Promise<CustomPkgResponseDTO | null>;
  deleteCustomPkg(customPkgId: string,companyId:string): Promise<boolean>;
  getAllRequestedCustomPkg(
    companyId: string,
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPkgTableDTO>>;
  getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null>;

  createCustomPackage(pkg: CompanyCreateCustomPackageDTO): Promise<PackageResponseDTO>
  getApprovedCustomPackage(
    companyId:string,
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPackageApprovedResponseDTO>>

  editCustomPackageData(
    id: string,
    data: CompanyEditCustomPackageDTO,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<void>;

}
