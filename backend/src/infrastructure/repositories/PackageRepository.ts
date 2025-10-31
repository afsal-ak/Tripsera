import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { PackageModel } from '@infrastructure/models/Package';
import { IPackage } from '@domain/entities/IPackage';
import { Types } from 'mongoose';
import { IFilter } from '@domain/entities/IFilter';
import { CustomPackageApprovedResponseDTO } from '@application/dtos/CustomPkgDTO';
import { IPackageFilter } from '@domain/entities/IPackageFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
import { SortOrder } from 'mongoose';
import { EnumPackageType } from '@constants/enum/packageEnum';

export class PackageRepository implements IPackageRepository {
  async create(pkg: IPackage): Promise<IPackage> {
    console.log(pkg, 'in db');

    const createPkg = await PackageModel.create(pkg);
    return createPkg.toObject();
  }

  async editPackage(
    id: string,
    data: Partial<IPackage>,
    deletedImages: { public_id: string }[] = [],
    newImages: { url: string; public_id: string }[] = []
  ): Promise<IPackage | null> {
    if (!Types.ObjectId.isValid(id)) throw new Error('Invalid package ID');
    const updateOps: any = {
      $set: { ...data },
    };

    if (deletedImages.length > 0) {
      await PackageModel.findByIdAndUpdate(id, {
        $pull: {
          imageUrls: {
            public_id: { $in: deletedImages.map((img) => img.public_id) },
          },
        },
      });
    }

    //  Push (add) new images
    if (newImages.length > 0) {
      await PackageModel.findByIdAndUpdate(id, {
        $push: {
          imageUrls: { $each: newImages },
        },
      });
    }

    return await PackageModel.findByIdAndUpdate(id, updateOps, { new: true });
  }

  async findAll(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ packages: IPackage[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;

    const matchStage: any = {};

    if (filters.status === 'active') matchStage.isBlocked = false;
    else if (filters.status === 'blocked') matchStage.isBlocked = true;

    if (filters.customFilter === 'custom') {
      matchStage.isCustom = true;
    } else if (filters.customFilter === 'normal') {
      //matchStage.isCustom = false;
      matchStage.$or = [{ isCustom: false }, { isCustom: { $exists: false } }];

    }

    if (filters.startDate && filters.endDate) {
      matchStage.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const sortOption: Record<string, 1 | -1> = {};
    if (filters.sort === 'asc') sortOption.createdAt = 1;
    else sortOption.createdAt = -1;

    const pipeline: any[] = [
      { $match: matchStage },

      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },

      // 3️ Search filter (title, description, category name)
      filters.search
        ? {
          $match: {
            $or: [
              { title: { $regex: filters.search, $options: 'i' } },
              { description: { $regex: filters.search, $options: 'i' } },
              { 'categoryDetails.name': { $regex: filters.search, $options: 'i' } },
            ],
          },
        }
        : undefined,

      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          offer: 1,
          durationDays: 1,
          durationNights: 1,
          'categoryDetails.name': 1,
          isCustom: 1,
          isBlocked: 1,
          createdAt: 1,
        },
      },
    ].filter(Boolean);

    const [packages, totalResult] = await Promise.all([
      PackageModel.aggregate(pipeline),
      PackageModel.aggregate([
        ...pipeline.filter((stage) => !('$skip' in stage) && !('$limit' in stage)),
        { $count: 'total' },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { packages, pagination };
  }
  async getAllUserCustomPackages(
    page: number,
    limit: number,
    filters: IFilter
  ): Promise<{ packages: CustomPackageApprovedResponseDTO[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;

    const matchStage: any = {
      packageType: EnumPackageType.CUSTOM,
      createdFor: { $exists: true, $ne: null },
    };

    // Status filter
    if (filters.status === 'active') matchStage.isBlocked = false;
    else if (filters.status === 'blocked') matchStage.isBlocked = true;

    // Date range filter
    if (filters.startDate && filters.endDate) {
      matchStage.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    // Sorting (default newest first)
    const sortOption: Record<string, 1 | -1> = {};
    if (filters.sort === 'asc') sortOption.createdAt = 1;
    else sortOption.createdAt = -1;

    const pipeline: any[] = [
      { $match: matchStage },

      // Populate createdFor (user)
      {
        $lookup: {
          from: 'users',
          localField: 'createdFor',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },

      // Populate customReqId (custom request info)
      {
        $lookup: {
          from: 'custompackages',
          localField: 'customReqId',
          foreignField: '_id',
          as: 'customReqDetails',
        },
      },
      { $unwind: { path: '$customReqDetails', preserveNullAndEmptyArrays: true } },

      // Search (by username or package title)
      filters.search
        ? {
          $match: {
            $or: [
              { title: { $regex: filters.search, $options: 'i' } },
              { 'userDetails.username': { $regex: filters.search, $options: 'i' } },
            ],
          },
        }
        : undefined,

      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          offer: 1,
          isBlocked: 1,
          isCustom: 1,
          createdAt: 1,
          'userDetails.username': 1,
          'userDetails.email': 1,
          'userDetails.profileImage.url': 1,
          'customReqDetails.packageName': 1,
          'customReqDetails.destination': 1,
          'customReqDetails.budget': 1,
        },
      },
    ].filter(Boolean);

    const [packages, totalResult] = await Promise.all([
      PackageModel.aggregate(pipeline),
      PackageModel.aggregate([
        ...pipeline.filter((stage) => !('$skip' in stage) && !('$limit' in stage)),
        { $count: 'total' },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { packages, pagination };
  }


  async countDocument(): Promise<number> {
    return PackageModel.countDocuments();
  }

  async findById(id: string): Promise<IPackage | null> {
    const pkg = await PackageModel.findById(id);
    return pkg?.toObject() || null;
  }

  async getHomeData(): Promise<IPackage[]> {
    const pkg = await PackageModel.find({
      isBlocked: false,
      isCustom: false
    })
      .limit(4)
      .lean();
    return pkg;
  }

  async getActivePackages(
    page: number,
    limit: number,
    filter?: IPackageFilter
  ): Promise<{ package: IPackage[]; pagination: PaginationInfo }> {
    const skip = (page - 1) * limit;

    const query: any = {
      isBlocked: false,
      $or: [{ isCustom: false }, { isCustom: { $exists: false } }],
    };

    if (filter?.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { 'location.name': { $regex: filter.search, $options: 'i' } },
      ];
    }

    if (filter?.category) {
      query.category = filter.category;
    }

    if (filter?.duration) {
      query.durationDays = filter.duration;
    }

    if (filter?.startDate && filter?.endDate) {
      query.startDate = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate),
      };
    }

    const sortOption: Record<string, SortOrder> = {};
    switch (filter?.sort) {
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'oldest':
        sortOption.createdAt = 1;
        break;
      case 'price_asc':
        sortOption.price = 1;
        break;
      case 'price_desc':
        sortOption.price = -1;
        break;
      default:
        sortOption.createdAt = -1;
        break;
    }

    const [packages, total] = await Promise.all([
      PackageModel.find(query)
        .populate({
          path: 'category',
          select: 'name isBlocked',
          match: { isBlocked: false }, // filter blocked categories
        })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      PackageModel.countDocuments(query),
    ]);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };

    return { package: packages, pagination };
  }

  async countActivePackages(filters: any): Promise<number> {
    const query = { ...filters, isBlocked: false, isCustom: false };
    return await PackageModel.countDocuments(query);
  }


  async getCustomPackagesForUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ packages: IPackage[]; pagination: PaginationInfo; }> {
    const skip = (page - 1) * limit;

    // Query for custom packages created for this user
    const query = {
      packageType: EnumPackageType.CUSTOM,
      createdFor: new Types.ObjectId(userId),
      isBlocked: false
    };

    const [packages, total] = await Promise.all([
      PackageModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PackageModel.countDocuments(query),
    ]);

    const pagination: PaginationInfo = {
      totalItems: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
    return {
      packages: packages,
      pagination: pagination
    };
  }
  async block(id: string): Promise<void> {
    const updatedPkg = await PackageModel.findByIdAndUpdate(id, {
      isBlocked: true,
    });
    if (!updatedPkg) {
      throw new Error('Package not found');
    }
  }

  async unblock(id: string): Promise<void> {
    const updatedPkg = await PackageModel.findByIdAndUpdate(id, {
      isBlocked: false,
    });
    if (!updatedPkg) {
      throw new Error('Package not found');
    }
  }

  async delete(id: string): Promise<void> {
    const deleted = await PackageModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error('Package not found');
    }
  }
}
