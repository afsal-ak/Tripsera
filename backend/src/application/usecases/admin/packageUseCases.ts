import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { generatePackageCode } from '@shared/utils/generatePackageCode';
import { IPackageUseCases } from '@application/useCaseInterfaces/admin/IPackageUseCases';
import {
  CreatePackageDTO,
  EditPackageDTO,
  PackageResponseDTO,
  PackageTableResponseDTO,
} from '@application/dtos/PackageDTO';
import { PackageMapper } from '@application/mappers/PackageMapper';
import { AppError } from '@shared/utils/AppError';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IFilter } from '@domain/entities/IFilter';
import { IPaginatedResult } from '@domain/entities/IPaginatedResult';
export class PackageUseCases implements IPackageUseCases {
  constructor(private _packageRepo: IPackageRepository) {}

  async getAllPackages(
    page: number,
    limit: number,
    filters?: IFilter
  ): Promise<IPaginatedResult<PackageTableResponseDTO>> {
    const result = await this._packageRepo.findAll(page, limit, filters);
    console.log(result, 'in usecase');

    return {
      data: result.packages.map(PackageMapper.toTableResponseDTO),
      pagination: result.pagination,
    };
  }

  async getSinglePackage(id: string): Promise<PackageResponseDTO | null> {
    const pkg = await this._packageRepo.findById(id);
    if (!pkg) return null;
    console.log(pkg, 'pcakge in usedcase');
    // Map to DTO before returning
    return PackageMapper.toResponseDTO(pkg);
  }

  async createPackage(pkg: CreatePackageDTO): Promise<PackageResponseDTO> {
    try {
      const packageCode = await generatePackageCode();

      // Compute final price
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

      const packageData = {
        ...pkg,
        packageCode,
        finalPrice,
      };

      const result = await this._packageRepo.create(packageData);
      return PackageMapper.toResponseDTO(result);
    } catch (error) {
      console.error('UseCase Error:', error);
      throw error;
    }
  }

  async editPackageData(
    id: string,
    data: Partial<EditPackageDTO>,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<void> {
    console.log(data, 'kd edit fata');
    const packageData = await this._packageRepo.findById(id);
    if (!packageData) throw new AppError(HttpStatus.NOT_FOUND, 'Package not found');

    const oldImages = packageData.imageUrls || [];

    // Delete images not in existingImages
    const deletedImages = oldImages.filter(
      (oldImg) => !existingImages.some((img) => img.public_id === oldImg.public_id)
    );
    for (const img of deletedImages) {
      await deleteImageFromCloudinary(img.public_id);
    }

    // Compute finalPrice if price or offer changed
    let finalPrice = data.price ?? packageData.price;
    const offer = data.offer ?? packageData.offer;
    const now = new Date();
    if (offer?.isActive && new Date(offer.validUntil) > now) {
      if (offer.type === 'percentage') {
        finalPrice = finalPrice - (finalPrice * offer.value) / 100;
      } else if (offer.type === 'flat') {
        finalPrice = finalPrice - offer.value;
      }
      finalPrice = Math.max(finalPrice, 0);
    }

    await this._packageRepo.editPackage(id, { ...data, finalPrice }, deletedImages, newImages);
  }

  async block(id: string): Promise<void> {
    return this._packageRepo.block(id);
  }
  async unblock(id: string): Promise<void> {
    return this._packageRepo.unblock(id);
  }
  async delete(id: string): Promise<void> {
    return this._packageRepo.delete(id);
  }
}
