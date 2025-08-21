import { CreateCustomPkgDTO, UpdateCustomPkgDTO } from "@application/dtos/CustomPkgDTO";
import { PaginationInfo } from "@application/dtos/PaginationDto";
import { ICustomPkgUseCases } from "@application/useCaseInterfaces/user/ICustomPackageUseCases";
import { ICustomPackage } from "@domain/entities/ICustomPackage";
import { IFilter } from "@domain/entities/IFilter";
import { ICustomPackageRepository } from "@domain/repositories/ICustomPackageRepository";

export class CustomPackageUseCases implements ICustomPkgUseCases{
    constructor(private readonly _customPkgRepo:ICustomPackageRepository){}

    async createCutomPkg(data: CreateCustomPkgDTO): Promise<ICustomPackage> {
        return await this._customPkgRepo.create(data)
    }

    async updateCutomPkg(customPkgId:string,userId:string,data: UpdateCustomPkgDTO): Promise<ICustomPackage|null> {
         const pkg= await this._customPkgRepo.updateByFilter({_id:customPkgId,userId},data)
         return pkg?pkg:null

    }

  async  getCustomPkgById(customPkgId: string): Promise<ICustomPackage | null> {
      return await this._customPkgRepo.findById(customPkgId)
  }

  async getAllCustomPkg(userId: string, page: number, limit: number, filters?: IFilter
  ): Promise<{ data: ICustomPackage[]; pagination: PaginationInfo; }> {
      return await this._customPkgRepo.findAll(page,limit,{userId})
  }

  async deleteCustomPkg(customPkgId: string, userId: string): Promise<boolean> {
      return await this._customPkgRepo.deleteByFilter({_id:customPkgId,userId})
  }
}