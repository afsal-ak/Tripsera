import { Request, Response } from 'express';
import { BannerMangementUseCases } from '@domain/usecases/admin/bannerUseCases';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { IBanner } from '@domain/entities/IBanner';

export class BannerMangementController {
  constructor(private bannerMangementUseCases: BannerMangementUseCases) {}

  createBanner = async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      const imagePath = req.file?.path;

      if (!imagePath) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const { url, public_id } = await uploadCloudinary(imagePath, 'banners');
      const banner: IBanner = {
        title,
        description,
        image: { url, public_id },
      };
      console.log(req.body, 'nbanner');
      const createdBanner = await this.bannerMangementUseCases.createNewBanner(banner);
      res.status(201).json({ message: 'Banner Created Successfully', banner });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  getBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;

      const { banners, totalBanner, totalPages } = await this.bannerMangementUseCases.getBanners(
        page,
        limit
      );

      res.status(200).json({
        message: 'Bannner fetched successfully',
        data: banners,
        totalBanner,
        totalPages,
        currentPage: page,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  blockBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bannerId } = req.params;
      await this.bannerMangementUseCases.blockBanner(bannerId);
      console.log({ bannerId });
      res.status(200).json({ message: 'Banner blocked successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };
  unblockBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bannerId } = req.params;
      await this.bannerMangementUseCases.unblockBanner(bannerId);
      res.status(200).json({ message: 'Banner unblocked successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  deleteBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bannerId } = req.params;
      console.log({ bannerId }, 'deleet');
      await this.bannerMangementUseCases.deleteBanner(bannerId);
      res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };
}
