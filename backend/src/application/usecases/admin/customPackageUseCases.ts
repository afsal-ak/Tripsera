import {
  UpdateCustomPkgStatusDTO,
  CustomPkgResponseDTO,
  CustomPkgTableDTO,
  AdminEditCustomPackageDTO,
  AdminCreateCustomPackageDTO,
  CustomPackageApprovedResponseDTO
} from '@application/dtos/CustomPkgDTO';
import { ICustomPkgUseCases } from '@application/useCaseInterfaces/admin/ICustomPackageUseCases';
import { IFilter } from '@domain/entities/IFilter';
import { ICustomPackageRepository } from '@domain/repositories/ICustomPackageRepository';
import { CustomPkgMapper } from '@application/mappers/CustomPkgMapper';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';

import { PackageMapper } from '@application/mappers/PackageMapper';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { PackageResponseDTO } from '@application/dtos/PackageDTO';
import { generatePackageCode } from '@shared/utils/generatePackageCode';

import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { EnumPackageType } from '@constants/enum/packageEnum';



export class CustomPackageUseCases implements ICustomPkgUseCases {
  constructor(
    private readonly _customPkgRepo: ICustomPackageRepository,
    private readonly _packageRepo: IPackageRepository
  ) { }

  async getCustomPkgById(customPkgId: string): Promise<CustomPkgResponseDTO | null> {
    const customPkg = await this._customPkgRepo.findById(customPkgId);
    return customPkg ? CustomPkgMapper.toResponseDTO(customPkg) : null;
  }

  async getAllRequestedCustomPkg(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPkgTableDTO>> {
    const result = await this._customPkgRepo.getAllRequestedCustomPkg(page, limit, filters);
    return {
      data: result.data.map(CustomPkgMapper.toTableDTO),
      pagination: result.pagination,
    };
  }

  async getApprovedCustomPackage(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<CustomPackageApprovedResponseDTO>> {
    const result = await this._packageRepo.getAllUserCustomPackages(page, limit, filters!);

    return {
      data: result.packages.map(CustomPkgMapper.toApprovedResponseDTO),
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

  async createCustomPackage(pkg: AdminCreateCustomPackageDTO): Promise<PackageResponseDTO> {
    try {
      const packageCode = await generatePackageCode();


      let finalPrice = pkg.price;
      const now = new Date();
      if (pkg.offer?.isActive && new Date(pkg.offer.validUntil) > now) {
        if (pkg.offer.type === 'percentage') {
          finalPrice = pkg.price - (pkg.price * pkg.offer.value) / 100;
        } else if (pkg.offer.type === 'flat') {
          finalPrice = pkg.price - pkg.offer.value;
        }
        finalPrice = Math.max(finalPrice, 0);
      }
      console.log(pkg, 'in usecaes');

      const packageData = {
        ...pkg,
        packageCode,
        finalPrice,
        packageType: EnumPackageType.CUSTOM
      };

      console.log(packageData, 'in usecaes data');

      const result = await this._packageRepo.create(packageData);

      return PackageMapper.toResponseDTO(result);
    } catch (error) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create custom package');
    }
  }


  async editCustomPackageData(
    id: string,
    data: AdminEditCustomPackageDTO,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<void> {
    const packageData = await this._packageRepo.findById(id);
    if (!packageData) throw new AppError(HttpStatus.NOT_FOUND, 'Package not found');

    if (packageData.packageType !== EnumPackageType.CUSTOM)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Not a custom package');

    const oldImages = packageData.imageUrls || [];

    // Delete removed images
    const deletedImages = oldImages.filter(
      (oldImg) => !existingImages.some((img) => img.public_id === oldImg.public_id)
    );

    for (const img of deletedImages) {
      await deleteImageFromCloudinary(img.public_id);
    }

    const finalPrice = data.price ?? packageData.price;

    await this._packageRepo.editPackage(id, { ...data, finalPrice }, deletedImages, newImages);
  }



}
