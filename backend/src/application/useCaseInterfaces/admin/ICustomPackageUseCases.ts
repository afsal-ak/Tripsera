 import { IPaginatedResult } from "@domain/entities/IPaginatedResult";
import { IFilter } from "@domain/entities/IFilter";
import { UpdateCustomPkgStatusDTO ,CustomPkgResponseDTO,CustomPkgTableDTO} from "@application/dtos/CustomPkgDTO";

export interface ICustomPkgUseCases {
    changeCustomPkgStatus(customPkgId: string, data: UpdateCustomPkgStatusDTO): Promise<CustomPkgResponseDTO | null>
    deleteCustomPkg(customPkgId: string): Promise<boolean>
    getAllCustomPkg(
        page: number,
        limit: number,
        filters?: IFilter

    ): Promise<IPaginatedResult<CustomPkgTableDTO>>;
    getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null>;

}