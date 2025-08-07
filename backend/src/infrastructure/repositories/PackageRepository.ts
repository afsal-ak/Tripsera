import { IPackageRepository } from '@domain/repositories/IPackageRepository';
import { PackageModel } from '@infrastructure/models/Package';
import { IPackage } from '@domain/entities/IPackage';
import { Types } from 'mongoose';
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

    const updateOps: any = { ...data };

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

  async findAll(skip: number, limit: number): Promise<IPackage[]> {
    return PackageModel.find({}).skip(skip).populate('category').limit(limit).lean();
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
      startDate: { $gte: Date.now() },
    })
      .limit(4)
      .lean();
    return pkg;
  }

  async getActivePackages(
    filters: any = {},
    skip: number,
    limit: number,
    sortBy: string
  ): Promise<IPackage[]> {
    const query = { ...filters, isBlocked: false };

    // const sortOption: any = { createdAt: -1 };
    // if (sort === "price_asc") sortOption.price = 1;
    // else if (sort === "price_desc") sortOption.price = -1;

    return await PackageModel.find(query)
      .populate('category')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();
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
