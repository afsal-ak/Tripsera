import { IPackage } from '@domain/entities/IPackage';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';

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
  getActivePackages(filters: any, skip: number, limit: number, sort: any, userId?: string ): Promise<IPackage[]>;
  countActivePackages(filters: any): Promise<number>;

  delete(id: string): Promise<void>;
  block(id: string): Promise<void>;
  unblock(id: string): Promise<void>;
  getHomeData(): Promise<IPackage[]>;

  getCustomPackagesForUser(
    userId:string,
    page:number,
    limit:number
  ):Promise<{ packages: IPackage[]; pagination: PaginationInfo }>
}
