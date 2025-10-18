import { ICategory } from '@domain/entities/ICategory';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { categoryModel } from '@infrastructure/models/Category';
import mongoose from 'mongoose';
import { IFilter } from '@domain/entities/IFilter';
import { PaginationInfo } from '@application/dtos/PaginationDto';


export class CategoryRepository implements ICategoryRepository {
  async createCategory(category: ICategory): Promise<ICategory> {
    const existing = await categoryModel.findOne({
      name: new RegExp(`^${category.name}$`, 'i'),
    });
    if (existing) {
      throw new Error('Category name already exists');
    }

    const newCategory = await categoryModel.create(category);
    return newCategory.toObject();
  }

  async editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new Error('Invalid category ID');
    }

    // Check if name is being changed and if it already exists
    if (categoryData.name) {
      const existing = await categoryModel.findOne({
        _id: { $ne: id },
        name: new RegExp(`^${categoryData.name}$`, 'i'),
      });

      if (existing) {
        throw new Error('Category name already exists');
      }
    }

    const updated = await categoryModel.findByIdAndUpdate(id, categoryData, { new: true }).lean();
    if (!updated) throw new Error('Category not found');
    return updated;
  }

  async getActiveCategory(): Promise<ICategory[]> {
    return await categoryModel.find({ isBlocked: false }).lean();
  }

async getAllCategories(
  page: number,
  limit: number,
  filters: IFilter
): Promise<{ data: ICategory[]; pagination: PaginationInfo }> {
  const skip = (page - 1) * limit;
  const matchStage: any = {};

  if (filters.search?.trim()) {
    matchStage.name = { $regex: filters.search.trim(), $options: "i" };
  }

  if (filters.status === "active") matchStage.isBlocked = false;
  else if (filters.status === "blocked") matchStage.isBlocked = true;

  const [categories, total] = await Promise.all([
    categoryModel.find(matchStage).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    categoryModel.countDocuments(matchStage),
  ]);

  const pagination: PaginationInfo = {
    totalItems: total,
    currentPage: page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
  };

  return { data: categories, pagination };
}

  async findById(id: string): Promise<ICategory | null> {
    return await categoryModel.findById(id).lean();
  }

  async blockCategory(id: string): Promise<void> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new Error('Invalid category ID');
    }
    const result = await categoryModel.findByIdAndUpdate(id, {
      isBlocked: true,
    });
    if (!isValidId) {
      throw new Error('Invalid category ID');
    }
  }

  async unblockCategory(id: string): Promise<void> {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new Error('Invalid category ID');

    const result = await categoryModel.findByIdAndUpdate(id, {
      isBlocked: false,
    });
    if (!result) {
      throw new Error('Category not found');
    }
  }
}
