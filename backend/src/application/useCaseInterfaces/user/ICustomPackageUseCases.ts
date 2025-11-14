import { IFilter } from '@domain/entities/IFilter';
import {
  CreateCustomPkgDTO,
  UpdateCustomPkgDTO,
  CustomPkgResponseDTO,
  CustomPkgUserListDTO,
} from '@application/dtos/CustomPkgDTO';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { PackageResponseDTO } from '@application/dtos/PackageDTO';

export interface ICustomPkgUseCases {
  //createCutomPkg(data: CreateCustomPkgDTO): Promise<CustomPkgResponseDTO>;
   createCutomPkg(data: CreateCustomPkgDTO): Promise<
    | {
        status: "exact_match";
        message: string;
        package: PackageResponseDTO[];
      }
    | {
        status: "similar_found";
        message: string;
        similarPackages: PackageResponseDTO[];
      }
    | {
        status: "created";
        message: string;
        customPackage: CustomPkgResponseDTO;
      }
  > 
  updateCutomPkg(
    customPkgId: string,
    userId: string,
    data: UpdateCustomPkgDTO
  ): Promise<CustomPkgResponseDTO | null>;
  deleteCustomPkg(customPkgId: string, userId: string): Promise<boolean>;
  getAllCustomPkg(
    userId: string,
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPkgUserListDTO>>;
  
  getCustomPackagesForUser(userId: string,page:number,limit:number
  ):Promise <IPaginatedResult<PackageResponseDTO>>
   

  getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null>;
}
