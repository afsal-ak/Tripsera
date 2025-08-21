import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { IFilter } from "@domain/entities/IFilter";
import { UpdateCustomPkgStatusDTO } from "@application/dtos/CustomPkgDTO";
export interface ICustomPkgUseCases {
    changeCustomPkgStatus(customPkgId: string, data: UpdateCustomPkgStatusDTO): Promise<ICustomPackage | null>
    deleteCustomPkg(customPkgId: string): Promise<boolean>
    getAllCustomPkg(
        page: number,
        limit: number,
        filters?: IFilter

    ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo }>;
    getCustomPkgById(customPkgId: string): Promise<ICustomPackage | null>;

}