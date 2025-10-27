import { ICustomPackage } from '@domain/entities/ICustomPackage';
import { IBaseRepository } from './IBaseRepository';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';

export interface ICustomPackageRepository extends IBaseRepository<ICustomPackage> {
  getAllRequestedCustomPkg(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo }>;

  changeStatusAndResponse(
    pkgId: string,
    data: Partial<ICustomPackage>
  ): Promise<ICustomPackage | null>;
}
