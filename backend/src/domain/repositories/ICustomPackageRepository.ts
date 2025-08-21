import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { IBaseRepository } from "./IBaseRepository";
import { UpdateCustomPkgStatusDTO } from "@application/dtos/CustomPkgDTO";
import { IFilter } from "@domain/entities/IFilter";
import { PaginationInfo } from "@application/dtos/PaginationDto";

export interface ICustomPackageRepository extends IBaseRepository<ICustomPackage> {
  getAllCustomPkgs(
        page: number,
        limit: number,
        filters?: IFilter
    ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo }>  
    changeStatusAndResponse(
        pkgId: string,
        data: UpdateCustomPkgStatusDTO
    ): Promise<ICustomPackage | null>
}