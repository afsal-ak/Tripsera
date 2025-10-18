import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { PackageModel } from '@infrastructure/models/Package';
import { IPackage } from '@domain/entities/IPackage';
import { Types } from 'mongoose';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';
export class PackageRepository implements IPackageRepository {
  async create(pkg: IPackage): Promise<IPackage> {
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
    console.log(updateOps, 'mogogngaonga')

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

   if (filters.status === "active") matchStage.isBlocked = false;
  else if (filters.status === "blocked") matchStage.isBlocked = true;

   if (filters.startDate && filters.endDate) {
    matchStage.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

   const sortOption: Record<string, 1 | -1> = {};
  if (filters.sort === "asc") sortOption.createdAt = 1;
  else sortOption.createdAt = -1;

   const pipeline: any[] = [
     { $match: matchStage },

     {
      $lookup: {
        from: "categories", 
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },

    // 3️ Search filter (title, description, category name)
    filters.search
      ? {
          $match: {
            $or: [
              { title: { $regex: filters.search, $options: "i" } },
              { description: { $regex: filters.search, $options: "i" } },
              { "categoryDetails.name": { $regex: filters.search, $options: "i" } },
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
        "categoryDetails.name": 1,
        isBlocked: 1,
        createdAt: 1,
      },
    },
  ].filter(Boolean); 

   const [packages, totalResult] = await Promise.all([
    PackageModel.aggregate(pipeline),
    PackageModel.aggregate([
      ...pipeline.filter(
        (stage) => !("$skip" in stage) && !("$limit" in stage)
      ),
      { $count: "total" },
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
    })
      .limit(4)
      .lean();
    console.log(pkg, 'pkg home')
    return pkg;
  }

async getActivePackages(
  filters: any = {},
  skip: number,
  limit: number,
  sortBy: string
): Promise<IPackage[]> {
 
   

  const pipeline: any[] = [
     { $match: { ...filters, isBlocked: false } },

     {
      $lookup: {
        from: "categories", // must match the actual MongoDB collection name
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },

     {
      $match: {
        "categoryDetails.isBlocked": { $ne: true },
      },
    },

     { $sort: sortBy },
    { $skip: skip },
    { $limit: limit },

     {
      $project: {
        title: 1,
        price: 1,
        finalPrice: 1,
        categoryDetails: { name: 1, isBlocked: 1 },
        createdAt: 1,
        durationDays: 1,
        durationNights: 1,
        imageUrls: 1,
      },
    },
  ];

  const packages = await PackageModel.aggregate(pipeline);
  return packages;
}

  async countActivePackages(filters: any): Promise<number> {
    const query = { ...filters, isBlocked: false };
    return await PackageModel.countDocuments(query);
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
