import { IWishlist } from "@domain/entities/IWishlist";
import { WishlistModel } from "@infrastructure/models/Wishlist";
import { MongoWishlistRepository } from "@infrastructure/repositories/MongoWishlistRepository";

export class WishlistUseCases{
    constructor( private wishlistRepo:MongoWishlistRepository ){}

    async addToWishlist(userId:string,packageId:string):Promise<void>{
        await this.wishlistRepo.addToWishlist(userId,packageId)
    }

    async removeFromWishList(userId:string,packageId:string){
        await this.wishlistRepo.removeFromWishlist(userId,packageId)
    }

    async getUserWishlist(userId:string,page:number,limit:number):Promise<{
        data:IWishlist[],
        currentPage:number,
        totalPage:number,
        totalItems:number
    }>{
        const [data,totalItems]=await Promise.all([
            this.wishlistRepo.getUserWishlist(userId,page,limit),
            this.wishlistRepo.countUserWishlist(userId)
        ])

        const totalPage=Math.ceil(totalItems/limit)
        return{
            data,
            currentPage:page,
            totalPage,
            totalItems
        }

    }
        
}