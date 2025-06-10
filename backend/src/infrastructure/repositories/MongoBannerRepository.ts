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

    async getAllBanners(): Promise<IBanner[]> {
       return await BannerModel.find().lean()
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