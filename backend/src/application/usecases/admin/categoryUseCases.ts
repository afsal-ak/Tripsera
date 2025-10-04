import { ICategory } from '@domain/entities/ICategory';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { ICategoryUseCases } from '@application/useCaseInterfaces/admin/ICategoryUseCases';
import { IFilter } from '@domain/entities/IFilter';

export class CategoryUseCases implements ICategoryUseCases {

  constructor(private _categoryRepo: ICategoryRepository) {}

  async getAllCategory({ page, limit }: { page: number; limit: number },filters:IFilter) {
    return await this._categoryRepo.getAllCategories(page, limit,filters);
  }
  async getActiveCategory(): Promise<ICategory[]> {
    return await this._categoryRepo.getActiveCategory();
  }

  async createCategory(category: ICategory): Promise<ICategory> {
    return this._categoryRepo.createCategory(category);
  }

  async findById(id: string): Promise<ICategory | null> {
    return this._categoryRepo.findById(id);
  }
  async editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory> {
    return this._categoryRepo.editCategory(id, categoryData);
  }

  async blockCategory(id: string): Promise<void> {
    await this._categoryRepo.blockCategory(id);
  }

  async unblockCategory(id: string): Promise<void> {
    await this._categoryRepo.unblockCategory(id);
  }
}
