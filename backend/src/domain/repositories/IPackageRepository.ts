import { IPackage } from '@domain/entities/IPackage';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { CreateCustomPkgDTO, CustomPackageApprovedResponseDTO } from '@application/dtos/CustomPkgDTO';
import { IPackageFilter } from '@domain/entities/IPackageFilter';


export interface IPackageRepository {
  create(pkg: IPackage): Promise<IPackage>;
  editPackage(
    id: string,
    data: Partial<IPackage>,
    deletedImages?: { public_id: string }[],
    newImages?: { url: string; public_id: string }[]
  ): Promise<IPackage | null>;

  findById(id: string): Promise<IPackage | null>;
  findAll(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<{ packages: IPackage[]; pagination: PaginationInfo }>;
  countDocument(): Promise<number>;
  getActivePackages(page: number, limit: number, filter?: IPackageFilter
  ): Promise<{ package: IPackage[], pagination: PaginationInfo }>;


  countActivePackages(filters: any): Promise<number>;

  delete(id: string): Promise<void>;
  block(id: string): Promise<void>;
  unblock(id: string): Promise<void>;
  getHomeData(): Promise<IPackage[]>;

  getCustomPackagesForUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ packages: IPackage[]; pagination: PaginationInfo }>

  getAllUserCustomPackages(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ packages: CustomPackageApprovedResponseDTO[]; pagination: PaginationInfo }>


  decrementSlots(packageId: string, slots: number): Promise<IPackage>
  incrementSlots(packageId: string, slots: number): Promise<IPackage>

  //for custom pkg suggestions
  findExactMatch(customPkg: CreateCustomPkgDTO): Promise<IPackage[] | null>
  findSimilarPackages(customPkg: CreateCustomPkgDTO): Promise<IPackage[] | null>

}
