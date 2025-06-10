import { IPackageRepository } from "@domain/repositories/IPackageRepository";
import { PackageModel } from "@infrastructure/models/Package";
import { IPackage } from "@domain/entities/IPackage";
import { Types } from "mongoose";
export class  MongoPackageRepository implements IPackageRepository {

    async create(pkg: IPackage): Promise<IPackage> {
        const createPkg=await PackageModel.create(pkg)
        return createPkg.toObject()
    }

    // async editPackage(id: string, data: Partial<IPackage>): Promise<IPackage|null> {
    //     const updatedPkg=await PackageModel.findByIdAndUpdate(id,data,{new:true})
    //     return updatedPkg?.toObject()||null
    // }

    // infrastructure/repositories/MongoPackageRepository.ts
async editPackage(
  id: string,
  data: Partial<IPackage>,
  deletedImages: { public_id: string }[] = [],
  newImages: { url: string; public_id: string }[] = []
): Promise<IPackage | null> {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid package ID");

  const updateOps: any = { ...data };

  if (deletedImages.length > 0) {
  await PackageModel.findByIdAndUpdate(id, {
    $pull: {
      imageUrls: {
        public_id: { $in: deletedImages.map(img => img.public_id) }
      }
    }
  });
}

//  Push (add) new images
if (newImages.length > 0) {
  await PackageModel.findByIdAndUpdate(id, {
    $push: {
      imageUrls: { $each: newImages }
    }
  });
}

  

  return await PackageModel.findByIdAndUpdate(id, updateOps, { new: true });
}



    async findAll(): Promise<IPackage[]> {
        const updatedPkg=await PackageModel.find().populate("category").lean()
        return updatedPkg
    }

   async findById(id: string): Promise<IPackage | null> {
        const pkg=await PackageModel.findById(id)
      return pkg ?.toObject()||null
    }

  async block(id: string): Promise<void> {
        const updatedPkg =await PackageModel.findByIdAndUpdate(id,{isBlocked:true})
        if (!updatedPkg ) {
            throw new Error("Package not found");
        }
    }

    async unblock(id: string): Promise<void> {
        const updatedPkg =await PackageModel.findByIdAndUpdate(id,{isBlocked:false})
        if (!updatedPkg ) {
            throw new Error("Package not found");
        }
    }

    async delete(id: string): Promise<void> {
  const deleted = await PackageModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("Package not found");
  }
    }



}