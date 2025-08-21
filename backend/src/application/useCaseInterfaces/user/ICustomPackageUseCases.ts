import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { IFilter } from "@domain/entities/IFilter";
import { CreateCustomPkgDTO,UpdateCustomPkgDTO,CustomPkgResponseDTO } from "@application/dtos/CustomPkgDTO";
export interface ICustomPkgUseCases{
    createCutomPkg(data:CreateCustomPkgDTO):Promise<ICustomPackage>
    updateCutomPkg(customPkgId:string,userId:string,data:UpdateCustomPkgDTO):Promise<ICustomPackage|null>
    deleteCustomPkg(customPkgId:string,userId:string):Promise<boolean>
    getAllCustomPkg(
        userId: string,
        page: number,
        limit: number,
        filters?:IFilter
      
      ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo }>;
      getCustomPkgById(customPkgId: string): Promise<ICustomPackage | null>;
    
}