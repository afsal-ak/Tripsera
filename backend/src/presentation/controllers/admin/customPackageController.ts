import { Request, Response, NextFunction } from 'express';
import { ICustomPkgUseCases } from '@application/useCaseInterfaces/admin/ICustomPackageUseCases';
import { AdminCreateCustomPackageDTO, AdminEditCustomPackageDTO, UpdateCustomPkgStatusDTO } from '@application/dtos/CustomPkgDTO';
import { HttpStatus } from '@constants/HttpStatus/HttpStatus';
import { IFilter } from '@domain/entities/IFilter';
import { CreatePackageDTO, EditPackageDTO } from '@application/dtos/PackageDTO';
import { parseJsonFields } from '@shared/utils/parseJsonFields';
import { uploadCloudinary } from '@infrastructure/services/cloudinary/cloudinaryService';
import { ImageInfoDTO } from '@application/dtos/PackageDTO';
export class CustomPackageController {
  constructor(private readonly _customPkgUseCases: ICustomPkgUseCases) { }

  changeCustomPkgStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const pkgId = req.params.packageId;
      const data: UpdateCustomPkgStatusDTO = req.body;

      const pkg = await this._customPkgUseCases.changeCustomPkgStatus(pkgId, data);

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: pkg,
        message: 'Package updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllRequestedCustomPkgs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
        sort: (req.query.sort as string) || '',
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
      };
      const data = await this._customPkgUseCases.getAllRequestedCustomPkg(page, limit, filters);
      res.status(HttpStatus.OK).json({
        data,
        message: 'Package fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  getAllApprovedCustomPkgs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;
      const filters: IFilter = {
        search: (req.query.search as string) || '',
        status: (req.query.status as string) || '',
        sort: (req.query.sort as string) || '',
        startDate: (req.query.startDate as string) || '',
        endDate: (req.query.endDate as string) || '',
      };
      const data = await this._customPkgUseCases.getApprovedCustomPackage(page, limit, filters);
      res.status(HttpStatus.OK).json({
        data,
        message: 'Package fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };


  getCustomPkgById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pkgId = req.params.packageId;

      const pkg = await this._customPkgUseCases.getCustomPkgById(pkgId);
      res.status(HttpStatus.OK).json({
        data: pkg,
        message: 'Package fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCustomPkg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pkgId = req.params.packageId;
      const result = await this._customPkgUseCases.deleteCustomPkg(pkgId);
      res.status(HttpStatus.OK).json({
        result,
        message: 'Package deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  createCustomPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log( req.body,'custom packgea creation body');

      let pkgData: AdminCreateCustomPackageDTO = req.body;
      console.log( pkgData,'custom after packgea creation body');

      // Parse fields that are sent as JSON strings
      pkgData = parseJsonFields(pkgData, [
        'location',
        'itinerary',
        'offer',
        'included',
        'notIncluded',
        'category',
      ]);

       console.log("Parsed package data:", pkgData);

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: 'No images uploaded' });
        return;
      }



      // Upload to cloudinary
      const imageUrls = await Promise.all(
        files.map((file) => uploadCloudinary(file.path, 'packages'))
      );

      // Add images to package DTO
      pkgData.imageUrls = imageUrls;
      if (pkgData.itinerary) {
        pkgData.itinerary = pkgData.itinerary.map((d: any, idx: number) => ({
          ...d,
          day: idx + 1, // auto-assign day
        }));
      }
      // Fix location geo: convert lat/lng strings -> numbers
      if (pkgData.location) {
        pkgData.location = pkgData.location.map((loc: any) => ({
          name: loc.name,
          geo: {
            type: 'Point',
            coordinates: [parseFloat(loc.lng), parseFloat(loc.lat)], // lng first, lat second
          },
        }));
      }

      // Create package via use case
      const createdPackage = await this._customPkgUseCases.createCustomPackage(pkgData);

      res.status(HttpStatus.CREATED).json({
        message: 'Package created successfully',
        package: createdPackage,
      });
    } catch (err) {
      next(err);
    }
  };

  editCustomPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Package ID is required' });
        return;
      }

      const body = req.body;
      const files = req.files as Express.Multer.File[] | undefined;
console.log(body,'custom packgea creation body');

      let pkgData: AdminEditCustomPackageDTO = body;

      pkgData = parseJsonFields(pkgData, [
        'location',
        'itinerary',
       // 'offer',
        'included',
        'notIncluded',
        'category',
      ]);

      const existingImages: ImageInfoDTO[] = Array.isArray(body.existingImages)
        ? body.existingImages
        : body.existingImages
          ? JSON.parse(body.existingImages)
          : [];

      const newImages: ImageInfoDTO[] = files?.length
        ? await Promise.all(files.map((f) => uploadCloudinary(f.path, 'packages')))
        : [];
      if (pkgData.location) {
        pkgData.location = pkgData.location.map((loc: any) => ({
          name: loc.name,
          geo: {
            type: 'Point',
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

      const updatedPackage = await this._customPkgUseCases.editCustomPackageData(
        id,
        pkgData,
        existingImages,
        newImages
      );

      res
        .status(HttpStatus.OK)
        .json({ message: 'Package updated successfully', package: updatedPackage });
    } catch (error) {
      next(error);
    }
  };
}
