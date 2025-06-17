import { IBannerRepository } from "@domain/repositories/IBannerRepository";
import { IBanner } from "@domain/entities/IBanner";
import { BannerModel } from "@infrastructure/models/Banner";
import { deleteImageFromCloudinary } from "@infrastructure/services/cloudinary/cloudinaryService";
import mongoose from "mongoose";

export class MongoBannerRepository implements IBannerRepository{
    async createBanner(banner: IBanner): Promise<IBanner> {
        const newBanner=await BannerModel.create(banner);
        return newBanner.toObject()
    }

    // async getAllBanners(): Promise<IBanner[]> {
    //    return await BannerModel.find().lean()
    // }

    async getAllBanners(skip: number, limit: number): Promise<IBanner[]> {
     return BannerModel.find({})
        .skip(skip)
        .limit(limit)
         .lean();
    }

 
    
    async countDocument(): Promise<number> {
      return  BannerModel.countDocuments()
    }

    async getAllActiveBanners(): Promise<IBanner[]> {
      return await BannerModel.find({isBlocked:false}).sort({ createdAt: -1 }).lean()
    }

      async blockBanner(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid banner ID format");
  }

  const banner = await BannerModel.findByIdAndUpdate(id,{isBlocked:true});
  if (!banner) {
    throw new Error("Banner not found");
  }

 
}
      async unblockBanner(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid banner ID format");
  }

  const banner = await BannerModel.findByIdAndUpdate(id,{isBlocked:false});
  if (!banner) {
    throw new Error("Banner not found");
  }

 
}

    async deleteBanner(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid banner ID format");
  }

  const banner = await BannerModel.findById(id);
  if (!banner) {
    throw new Error("Banner not found");
  }

  if (banner.image?.public_id) {
    await deleteImageFromCloudinary(banner.image.public_id);
  }

  await BannerModel.findByIdAndDelete(id);
}

}