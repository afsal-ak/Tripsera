import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IPackage } from '@domain/entities/IPackage';
import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { generatePackageCode } from '@shared/utils/generatePackageCode';
import { IPackageUseCases } from '@application/useCaseInterfaces/admin/IPackageUseCases';

export class PackageUseCases implements IPackageUseCases {

  constructor(private _packageRepo: IPackageRepository) {}

  async getAllPackages(
    page: number,
    limit: number
  ): Promise<{
    packages: IPackage[];
    totalPackages: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [packages, totalPackages] = await Promise.all([
      this._packageRepo.findAll(skip, limit),
      this._packageRepo.countDocument(),
    ]);

    return {
      packages,
      totalPackages,
      totalPages: Math.ceil(totalPackages / limit),
    };
  }

  async getSinglePackage(id: string): Promise<IPackage | null> {
    return this._packageRepo.findById(id);
  }

  async createPackage(pkg: IPackage): Promise<IPackage> {
    try {
      // const result = await this.packageRepo.create(pkg);
      // return result;
      const packageCode = await generatePackageCode();
      const packageData = {
        ...pkg,
        packageCode,
      };

      const result = await this._packageRepo.create(packageData);
      return result;
    } catch (error) {
      console.error(' UseCase Error:', error);
      throw error;
    }
  }

  async editPackageData(
    id: string,
    data: Partial<IPackage>,
    existingImages: { public_id: string }[],
    newImages: { url: string; public_id: string }[]
  ): Promise<void> {
    const packageData = await this._packageRepo.findById(id);
    if (!packageData) throw new Error('Package not found');

    const oldImages = packageData.imageUrls || [];

    //  Find which images to delete (not included in existingImages)
    const deletedImages = oldImages.filter(
      (oldImg) => !existingImages.some((img) => img.public_id === oldImg.public_id)
    );

    //  Delete them from Cloudinary
    for (const img of deletedImages) {
      await deleteImageFromCloudinary(img.public_id);
    }

    await this._packageRepo.editPackage(id, data, deletedImages, newImages);
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
