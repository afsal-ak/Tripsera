import { Request, Response } from "express";
import { WishlistUseCases } from "@domain/usecases/user/wishlistUseCases";
import { getUserIdFromRequest } from "@shared/utils/getUserIdFromRequest";

export class WishlistController {
    constructor(private wishlistUseCases: WishlistUseCases) { }

    addToWishlist = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id
            if (!userId) {
                res.status(401).json({ message: "User ID is missing" });
                return
            }
            const { packageId } = req.body
            //console.log(req.body,'wishlst')
            //console.log(userId,'userid')
            // console.log(req.user,'req.user')

            const result = await this.wishlistUseCases.addToWishlist(userId.toString(), packageId)
            res.status(200).json({ result, message: 'Package added to wishlist successfully' })
        } catch (error: any) {
            console.log(error.message)
            res.status(400).json({ message: error.message });
        }

    }

   checkPackageInWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserIdFromRequest(req);
    const packageId = req.query.packageId as string;
    console.log(packageId,'packge id in wishlist')
      if (!packageId) {
      res.status(400).json({ message: "packageId is required" });
      return;
    }


    const result = await this.wishlistUseCases.checkPackageInWishlist(userId, packageId);
    console.log(result,'result')
    res.status(200).json({ result, message: 'Package check successful' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


    removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id
            // console.log(userId,'wishlist userid')

            const { packageId } = req.body
            //  console.log(req.body,'wishlist')
            if (!userId) {
                res.status(401).json({ message: "unauthorised" })
                return
            }

            await this.wishlistUseCases.removeFromWishList(userId?.toString(), packageId)
            res.status(200).json({ message: "package removed successfully" })

        } catch (error: any) {
            console.log(error.message)
            res.status(400).json({ message: error.message });
        }
    }

    getAllWishlist = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id
            if (!userId) {
                res.status(401).json({ message: "unauthorised" })
                return
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;

            console.log(page, limit, 'page and limit')
            const result = await this.wishlistUseCases.getUserWishlist(
                userId.toString(),
                page,
                limit)

            res.status(200).json({
                ...result,
                message: "wishlist fetched successfully"
            })

        } catch (error: any) {
            console.log(error.message)
            res.status(400).json({ message: error.message });
        }
    }


}