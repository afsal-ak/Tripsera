import { IPackageRepository } from "@domain/repositories/IPackageRepository";
import { IPackage } from "@domain/entities/IPackage";
import { deleteImageFromCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";

export class PackageUseCases {
    constructor(
        private packageRepo:IPackageRepository
    ){}


    async getAllPackages():Promise<IPackage[]>{
        return this.packageRepo.findAll()
    }

    async getSinglePackage(id:string){
        return this.packageRepo.findById(id)
    }

    async createPackage(pkg:IPackage):Promise<IPackage>{
        return this.packageRepo.create(pkg)
    }

    async editPackageData( id: string,
  data: Partial<IPackage>,
  deletedImages: { public_id: string }[],
  newImages: { url: string; public_id: string }[]
): Promise<void> {
     if (deletedImages.length > 0) {
    for (const img of deletedImages) {
      await deleteImageFromCloudinary(img.public_id);
    }
  }

  await this.packageRepo.editPackage(id, data, deletedImages, newImages);
    }

    async block(id:string):Promise<void>{
        return this.packageRepo.block(id)
    }
 async unblock(id:string):Promise<void>{
        return this.packageRepo.unblock(id)
    }
 async delete(id:string):Promise<void>{
        return this.packageRepo.delete(id)
    }

}