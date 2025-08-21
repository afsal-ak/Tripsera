import { CreateCustomPkgDTO, UpdateCustomPkgDTO, UpdateCustomPkgStatusDTO } from "@application/dtos/CustomPkgDTO";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { ICustomPkgUseCases } from "@application/useCaseInterfaces/admin/ICustomPackageUseCases";
import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { IFilter } from "@domain/entities/IFilter";
import { ICustomPackageRepository } from "@domain/repositories/ICustomPackageRepository";

export class CustomPackageUseCases implements ICustomPkgUseCases{
    constructor(private readonly _customPkgRepo:ICustomPackageRepository){}
 
 

  async  getCustomPkgById(customPkgId: string): Promise<ICustomPackage | null> {
      return await this._customPkgRepo.findById(customPkgId)
  }

  async getAllCustomPkg( page: number, limit: number, filters?: IFilter
  ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo; }> {
      return await this._customPkgRepo.getAllCustomPkgs(page,limit,filters)
  }
async changeCustomPkgStatus(customPkgId: string, data: UpdateCustomPkgStatusDTO): Promise<ICustomPackage | null> {
    return await this._customPkgRepo.changeStatusAndResponse(customPkgId,data)
}
  async deleteCustomPkg(customPkgId: string): Promise<boolean> {
      return await this._customPkgRepo.delete(customPkgId)
  }
}