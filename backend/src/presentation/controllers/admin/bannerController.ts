import { NextFunction, Request, Response } from 'express';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { IBanner } from '@domain/entities/IBanner';
import { IBannerManagementUseCases } from '@application/useCaseInterfaces/admin/IBannerManagementUseCases';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';

export class BannerMangementController {
  constructor(private _bannerMangementUseCases: IBannerManagementUseCases) { }

  createBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const imagePath = req.file?.path;

      if (!imagePath) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
        return;
      }

      const { url, public_id } = await uploadCloudinary(imagePath, 'banners');
      const banner: IBanner = {
        title,
        description,
        image: { url, public_id },
      };
      const createdBanner = await this._bannerMangementUseCases.createNewBanner(banner);
      res.status(HttpStatus.CREATED).json({ message: 'Banner Created Successfully', banner: createdBanner });
    } catch (error) {
      next(error)
    }
  };

  getBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;

      const { banners, totalBanner, totalPages } = await this._bannerMangementUseCases.getBanners(
        page,
        limit
      );

      res.status(HttpStatus.OK).json({
        message: 'Bannner fetched successfully',
        data: banners,
        totalBanner,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      next(error)
    }
  };

  blockBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { bannerId } = req.params;
      await this._bannerMangementUseCases.blockBanner(bannerId);
      res.status(HttpStatus.OK).json({ message: 'Banner blocked successfully' });
    } catch (error) {
      next(error)
    }
  };
  unblockBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { bannerId } = req.params;
      await this._bannerMangementUseCases.unblockBanner(bannerId);
      res.status(HttpStatus.OK).json({ message: 'Banner unblocked successfully' });
    } catch (error) {
      next(error)
    }
  };

  deleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { bannerId } = req.params;
      await this._bannerMangementUseCases.deleteBanner(bannerId);
      res.status(HttpStatus.OK).json({ message: 'Banner deleted successfully' });
    } catch (error) {
      next(error)
    }
  };
}
