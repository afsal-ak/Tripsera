import {
  UpdateCustomPkgStatusDTO,
  CustomPkgResponseDTO,
  CustomPkgTableDTO,
} from '@application/dtos/CustomPkgDTO';
import { ICustomPkgUseCases } from '@application/useCaseInterfaces/admin/ICustomPackageUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { ICustomPackageRepository } from '@domain/repositories/ICustomPackageRepository';
import { CustomPkgMapper } from '@application/mappers/CustomPkgMapper';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export class CustomPackageUseCases implements ICustomPkgUseCases {
  constructor(private readonly _customPkgRepo: ICustomPackageRepository) {}

  async getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null> {
    const customPkg = await this._customPkgRepo.findById(customPkgId);
    return customPkg ? CustomPkgMapper.toResponseDTO(customPkg) : null;
  }

  async getAllCustomPkg(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPkgTableDTO>> {
    const result = await this._customPkgRepo.getAllCustomPkgs(page, limit, filters);
    return {
      data: result.data.map(CustomPkgMapper.toTableDTO),
      pagination: result.pagination,
    };
  }

  async changeCustomPkgStatus(
    customPkgId: string,
    data: UpdateCustomPkgStatusDTO
  ): Promise<CustomPkgResponseDTO | null> {
    const customPkg = await this._customPkgRepo.changeStatusAndResponse(customPkgId, data);
    return customPkg ? CustomPkgMapper.toResponseDTO(customPkg) : null;
  }
  async deleteCustomPkg(customPkgId: string): Promise<boolean> {
    return await this._customPkgRepo.delete(customPkgId);
  }
}
