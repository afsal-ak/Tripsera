import {
  CreateCustomPkgDTO,
  UpdateCustomPkgDTO,
  CustomPkgResponseDTO,
  CustomPkgUserListDTO,
} from '@application/dtos/CustomPkgDTO';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
import { INotificationUseCases } from '@application/useCaseInterfaces/notification/INotificationUseCases';
import { ICustomPkgUseCases } from '@application/useCaseInterfaces/user/ICustomPackageUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { ICustomPackageRepository } from '@domain/repositories/ICustomPackageRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { CustomPkgMapper } from '@application/mappers/CustomPkgMapper';
import { EnumUserRole } from '@constants/enum/userEnum';
import { EnumNotificationEntityType, EnumNotificationType } from '@constants/enum/notificationEnum';
import { PackageResponseDTO } from '@application/dtos/PackageDTO';
import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { PackageMapper } from '@application/mappers/PackageMapper';

export class CustomPackageUseCases implements ICustomPkgUseCases {
  constructor(
    private readonly _customPkgRepo: ICustomPackageRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _packageRepo: IPackageRepository,

    private readonly _notificationUseCases: INotificationUseCases
  ) { }


  async updateCutomPkg(
    customPkgId: string,
    userId: string,
    data: UpdateCustomPkgDTO
  ): Promise<CustomPkgResponseDTO | null> {
    const pkg = await this._customPkgRepo.updateByFilter({ _id: customPkgId, userId }, data);
    return pkg ? CustomPkgMapper.toResponseDTO(pkg) : null;
  }

  async getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null> {
    const pkg = await this._customPkgRepo.findById(customPkgId);
    return CustomPkgMapper.toResponseDTO(pkg!);
  }

  async getAllCustomPkg(
    userId: string,
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPkgUserListDTO>> {
    const result = await this._customPkgRepo.findAll(page, limit, { userId });
    return {
      pagination: result.pagination,
      data: result.data.map(CustomPkgMapper.toUserListDTO),
    };
  }

  async deleteCustomPkg(customPkgId: string, userId: string): Promise<boolean> {
    return await this._customPkgRepo.deleteByFilter({ _id: customPkgId, userId });
  }

  async getCustomPackagesForUser(userId: string, page: number, limit: number
  ): Promise<IPaginatedResult<PackageResponseDTO>> {
    const result = await this._packageRepo.getCustomPackagesForUser(userId, page, limit)
    return {
      data: result.packages.map(PackageMapper.toResponseDTO),
      pagination: result.pagination
    }
  }

  //  Suggest 
  async suggestPackages(
    data: CreateCustomPkgDTO
  ): Promise<{
    exactMatch?: PackageResponseDTO[];
    similarPackages?: PackageResponseDTO[];
  }> {
    const exact = await this._packageRepo.findExactMatch(data);

    if (exact) {
      return { exactMatch: exact.map(PackageMapper.toResponseDTO) };
    }

    const similar = await this._packageRepo.findSimilarPackages(data);

    if (similar && similar.length > 0) {
      return { similarPackages: similar.map(PackageMapper.toResponseDTO) };
    }

    return {};
  }

  async createCutomPkg(data: CreateCustomPkgDTO): Promise<
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
  > {
    //  Suggest first
    const suggestion = await this.suggestPackages(data);

    // 2️ Handle existing matches
    if (suggestion.exactMatch) {
      return {
        status: "exact_match",
        message: "An exact matching package already exists.",
        package: suggestion.exactMatch,
      };
    }

    if (suggestion.similarPackages && suggestion.similarPackages.length > 0) {
      return {
        status: "similar_found",
        message: "We found similar packages that may fit your request.",
        similarPackages: suggestion.similarPackages,
      };
    }

    //  Create new custom package request
    const customPkg = await this._customPkgRepo.create(data);

    const userId = customPkg.userId?.toString();
    const user = await this._userRepo.findById(userId!);
    const message = `User ${user?.username} requested a custom package.`;

    await this._notificationUseCases.sendNotification({
      role: EnumUserRole.ADMIN,
      title: "Custom Package Request",
      entityType: EnumNotificationEntityType.CUSTOM_PACKAGE,
      customPackageId: customPkg._id?.toString(),
      message,
      type: EnumNotificationType.REQUEST,
      triggeredBy: userId,
    });

    return {
      status: "created",
      message: "No similar packages found. Custom package request created successfully.",
      customPackage: CustomPkgMapper.toResponseDTO(customPkg),
    };
  }

}
