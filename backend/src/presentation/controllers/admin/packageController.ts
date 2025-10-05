import { Request, Response, NextFunction } from 'express';
import { IPackage, ImageInfo } from '@domain/entities/IPackage';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { IPackageUseCases } from '@application/useCaseInterfaces/admin/IPackageUseCases';
import { CreatePackageDTO, EditPackageDTO } from '@application/dtos/PackageDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { parseJsonFields } from '@shared/utils/parseJsonFields';


export class PackageController {

  constructor(private _packageUseCase: IPackageUseCases) { }

  getFullPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { packages, totalPackages, totalPages } = await this._packageUseCase.getAllPackages(
        page,
        limit
      );
       res.status(HttpStatus.OK).json({
        message: 'Package fetched successfully',
        data: packages,
        totalPackages,
        totalPages,
        currentPage: page,
      });
    } catch (error: any) {
      next(error)
    }
  };

  getPackagesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const packages = await this._packageUseCase.getSinglePackage(id);
 
      res.status(HttpStatus.OK).json({ message: 'Package fetched successfully', packages });
    } catch (error: any) {
      next(error)
    }
  };

  createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pkgData: CreatePackageDTO = req.body;
 
      // Parse fields that are sent as JSON strings
      pkgData = parseJsonFields(pkgData, [
        "location",
        "itinerary",
        "offer",
        "included",
        "notIncluded",
        "category"
      ]);

     // console.log("Parsed package data:", pkgData);

       const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "No images uploaded" });
        return;
      }

      files.forEach((file) => {
        console.log(`File: ${file.originalname} | Size: ${(file.size / 1024).toFixed(2)} KB`);
      });

      // Upload to cloudinary
      const imageUrls = await Promise.all(
        files.map((file) => uploadCloudinary(file.path, "packages"))
      );

      // Add images to package DTO
      pkgData.imageUrls = imageUrls;
      if (pkgData.itinerary) {
        pkgData.itinerary = pkgData.itinerary.map((d: any, idx: number) => ({
          ...d,
          day: idx + 1,  // auto-assign day
        }));
      }
      // Fix location geo: convert lat/lng strings -> numbers
      if (pkgData.location) {
        pkgData.location = pkgData.location.map((loc: any) => ({
          name: loc.name,
          geo: {
            type: "Point",
            coordinates: [parseFloat(loc.lng), parseFloat(loc.lat)], // lng first, lat second
          },
        }));
      }

      // Create package via use case
      const createdPackage = await this._packageUseCase.createPackage(pkgData);

      res.status(HttpStatus.CREATED).json({
        message: "Package created successfully",
        package: createdPackage,
      });
    } catch (err) {
      next(err);
    }
  };

  editPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Package ID is required" });
        return;
      }

      const body = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      let pkgData: EditPackageDTO = body;

      pkgData = parseJsonFields(pkgData, [
        "location",
        "itinerary",
        "offer",
        "included",
        "notIncluded",
        "category"
      ]);

      const existingImages: ImageInfo[] = Array.isArray(body.existingImages)
        ? body.existingImages
        : body.existingImages
          ? JSON.parse(body.existingImages)
          : [];

      const newImages: ImageInfo[] = files?.length
        ? await Promise.all(files.map(f => uploadCloudinary(f.path, "packages")))
        : [];
      if (pkgData.location) {
        pkgData.location = pkgData.location.map((loc: any) => ({
          name: loc.name,
          geo: {
            type: "Point",
            coordinates: [parseFloat(loc.lng), parseFloat(loc.lat)],
          },
        }));
      }

      if (pkgData.itinerary) {
        pkgData.itinerary = pkgData.itinerary.map((d: any, idx: number) => ({
          ...d,
          day: idx + 1,
        }));
      }

      const updatedPackage = await this._packageUseCase.editPackageData(id, pkgData, existingImages, newImages);

      res.status(HttpStatus.OK).json({ message: "Package updated successfully", package: updatedPackage });
    } catch (error: any) {
      console.error(error);
      next(error)
    }
  };

  blockPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      //console.log(id, 'pid');
      await this._packageUseCase.block(id);
      res.status(HttpStatus.OK).json({ message: 'Package blocked successfully' });
    } catch (error: any) {
      next(error)
    }
  };

  unblockPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._packageUseCase.unblock(id);
      res.status(HttpStatus.OK).json({ message: 'Package unblocked successfully' });
    } catch (error: any) {
      next(error)
    }
  };

  deletePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this._packageUseCase.delete(id);
      res.status(HttpStatus.OK).json({ message: 'Package deleted successfully' });
    } catch (error: any) {
      next(error)
    }
  };
}
