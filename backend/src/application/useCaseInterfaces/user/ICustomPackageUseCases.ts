import { IFilter } from "@domain/entities/IFilter";
import { CreateCustomPkgDTO,UpdateCustomPkgDTO,CustomPkgResponseDTO,CustomPkgUserListDTO } from "@application/dtos/CustomPkgDTO";
import { IPaginatedResult } from "@domain/entities/IPaginatedResult";

export interface ICustomPkgUseCases{
    createCutomPkg(data:CreateCustomPkgDTO):Promise<CustomPkgResponseDTO>
    updateCutomPkg(customPkgId:string,userId:string,data:UpdateCustomPkgDTO):Promise<CustomPkgResponseDTO|null>
    deleteCustomPkg(customPkgId:string,userId:string):Promise<boolean>
    getAllCustomPkg(
        userId: string,
        page: number,
        limit: number,
        filters?:IFilter
      
      ): Promise<IPaginatedResult<CustomPkgUserListDTO>>  
    
      getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null>;
    
}