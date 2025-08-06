import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { IPackage } from '@domain/entities/IPackage';
import { deleteImageFromCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { generatePackageCode } from '@shared/utils/generatePackageCode';
export class PackageUseCases {
  constructor(private packageRepo: IPackageRepository) { }

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
      this.packageRepo.findAll(skip, limit),
      this.packageRepo.countDocument(),
    ]);

    return {
      packages,
      totalPackages,
      totalPages: Math.ceil(totalPackages / limit),
    };
  }

  async getSinglePackage(id: string): Promise<IPackage | null> {
    return this.packageRepo.findById(id);
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

      const result = await this.packageRepo.create(packageData);
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
    const packageData = await this.packageRepo.findById(id);
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

    await this.packageRepo.editPackage(id, data, deletedImages, newImages);
  }

  async block(id: string): Promise<void> {
    return this.packageRepo.block(id);
  }
  async unblock(id: string): Promise<void> {
    return this.packageRepo.unblock(id);
  }
  async delete(id: string): Promise<void> {
    return this.packageRepo.delete(id);
  }
}
