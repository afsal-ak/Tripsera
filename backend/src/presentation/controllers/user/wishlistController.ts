import { NextFunction, Request, Response } from 'express';
import { getUserIdFromRequest } from '@shared/utils/getUserIdFromRequest';
import { HttpStatus } from 'constants/HttpStatus/HttpStatus';
import { IWishlistUseCases } from '@application/useCaseInterfaces/user/IWishlistUseCases';

export class WishlistController {
  constructor(private _wishlistUseCases: IWishlistUseCases) {}

  addToWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const { packageId } = req.body;

      const result = await this._wishlistUseCases.addToWishlist(userId, packageId);
      res
        .status(HttpStatus.CREATED)
        .json({ result, message: 'Package added to wishlist successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  checkPackageInWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);
      const packageId = req.query.packageId as string;
      console.log(packageId, 'packge id in wishlist');
      if (!packageId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'packageId is required' });
        return;
      }

      const result = await this._wishlistUseCases.checkPackageInWishlist(userId, packageId);
      console.log(result, 'result');
      res.status(HttpStatus.OK).json({ result, message: 'Package check successful' });
    } catch (error: any) {
      next(error);
    }
  };

  removeFromWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const { packageId } = req.body;
      //  console.log(req.body,'wishlist')
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'unauthorised' });
        return;
      }

      await this._wishlistUseCases.removeFromWishList(userId, packageId);
      res.status(HttpStatus.OK).json({ message: 'package removed successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  getAllWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getUserIdFromRequest(req);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      console.log(page, limit, 'page and limit');
      const result = await this._wishlistUseCases.getUserWishlist(userId, page, limit);

      res.status(HttpStatus.OK).json({
        ...result,
        message: 'wishlist fetched successfully',
      });
    } catch (error: any) {
      next(error);
    }
  };
}
