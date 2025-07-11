import { WishlistModel } from "@infrastructure/models/Wishlist";
import { IWishlist } from "@domain/entities/IWishlist";
import { IWishlistRepository } from "@domain/repositories/IWishlistRepository";
import { UserModel } from "@infrastructure/models/User";

export class MongoWishlistRepository implements IWishlistRepository {
    async addToWishlist(userId: string, packageId: string): Promise<void> {
         const existing=await WishlistModel.findOne({userId,packageId})
          if (existing) {
                throw new Error("Product is already in your wishlist");
            }
         
            await WishlistModel.create({
                userId,
                packageId
            })
         

    }

    async checkPackageInWishlist(userId: string, packageId: string): Promise<boolean> {
        const existing=await WishlistModel.exists({userId,packageId})
      return !!existing;
    }

    async getUserWishlist(userId: string,page:number,limit:number): Promise<IWishlist[]> {
        const skip=(page-1)*limit
        return await WishlistModel.find({userId})
        .populate('packageId','title price duration location imageUrls')
        .skip(skip)
        .limit(limit)
        .lean()
          
        
    }
    async countUserWishlist(userId: string): Promise<number> {
  return await WishlistModel.countDocuments({ userId });
}


    async removeFromWishlist(userId: string, packageId: string): Promise<void> {
        await WishlistModel.deleteOne({userId,packageId})
    }

}