import { Request, Response } from 'express';
import { PackageUseCases } from '@domain/usecases/admin/packageUseCases';
import { IPackage } from '@domain/entities/IPackage';
import cloudinary from '@infrastructure/services/cloudinary/cloudinary';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';

export class PackageController {
  constructor(private packageUseCase: PackageUseCases) {}

  getFullPackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { packages, totalPackages, totalPages } = await this.packageUseCase.getAllPackages(
        page,
        limit
      );
      console.log(packages, 'pack');
      res.status(200).json({
        message: 'Package fetched successfully',
        data: packages,
        totalPackages,
        totalPages,
        currentPage: page,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  getPackagesById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const packages = await this.packageUseCase.getSinglePackage(id);
      res.status(200).json({ message: 'Package fetched successfully', packages });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  createPackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
      //console.log(req.files,'fil')

      const pkg: IPackage = {
        ...req.body,
        price: Number(req.body.price),
        location: JSON.parse(req.body.location || '[]'),
        category: JSON.parse(req.body.category || '[]'),
        included: JSON.parse(req.body.included || '[]'),
        notIncluded: JSON.parse(req.body.notIncluded || '[]'),
        itinerary: JSON.parse(req.body.itinerary || '[]'),
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
        isBlocked: false,
      };

      const imageUrls = await Promise.all(
        files.map((file) => uploadCloudinary(file.path, 'packages'))
      );
      pkg.imageUrls = imageUrls;

      const createdPkg = await this.packageUseCase.createPackage(pkg);
      //console.log({createdPkg},'creted pkd')
      res.status(200).json({ message: 'Package created successfully', createdPkg });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  // Edit Package
  editPackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body;
      const files = req.files as Express.Multer.File[];

      //  Parse existingImageUrls from the frontend
      const existingImageUrls: { public_id: string }[] = body.existingImageUrls
        ? JSON.parse(body.existingImageUrls)
        : [];

      console.log('EXISTING IMAGES TO KEEP:', existingImageUrls);

      const pkgData: Partial<IPackage> = {
        title: body.title,
        description: body.description,
        duration: body.duration,
        price: body.price ? Number(body.price) : undefined,
        location: body.location ? JSON.parse(body.location) : undefined,
        category: body.category ? JSON.parse(body.category) : undefined,
        included: body.included ? JSON.parse(body.included) : undefined,
        notIncluded: body.notIncluded ? JSON.parse(body.notIncluded) : undefined,
        itinerary: body.itinerary ? JSON.parse(body.itinerary) : undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      };

      //  Upload new images
      const newImages = files?.length
        ? await Promise.all(files.map((file) => uploadCloudinary(file.path, 'packages')))
        : [];

      //  Pass correct data to use case
      await this.packageUseCase.editPackageData(id, pkgData, existingImageUrls, newImages);

      res.status(200).json({ message: 'Package updated successfully' });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  xeditPackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body;
      const files = req.files as Express.Multer.File[];
      // Parse fields if they are JSON strings
      const deletedImages: { public_id: string }[] = body.deletedImages
        ? JSON.parse(body.deletedImages)
        : [];
      console.log(deletedImages, 'edit pkg');

      const location = body.location ? JSON.parse(body.location) : undefined;
      const category = body.category ? JSON.parse(body.category) : undefined;

      const pkgData: Partial<IPackage> = {
        title: body.title,
        description: body.description,
        duration: body.duration,
        price: body.price ? Number(body.price) : undefined,
        location,
        category,
      };

      const newImages: { url: string; public_id: string }[] = files?.length
        ? await Promise.all(files.map((file) => uploadCloudinary(file.path, 'packages')))
        : [];
      await this.packageUseCase.editPackageData(id, pkgData, deletedImages, newImages);

      res.status(200).json({ message: 'Package updated successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  blockPackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      console.log(id, 'pid');
      await this.packageUseCase.block(id);
      res.status(200).json({ message: 'Package blocked successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  unblockPackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.packageUseCase.unblock(id);
      res.status(200).json({ message: 'Package unblocked successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };

  deletePackage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.packageUseCase.delete(id);
      res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Something went wrong' });
    }
  };
}
