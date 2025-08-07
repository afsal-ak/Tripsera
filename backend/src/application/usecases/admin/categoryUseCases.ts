import { ICategory } from '@domain/entities/ICategory';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { ICategoryUseCases } from '@application/useCaseInterfaces/admin/ICategoryUseCases';
export class CategoryUseCases implements ICategoryUseCases{
  constructor(private categoryRepo: ICategoryRepository) {}

  async getAllCategory({ page, limit }: { page: number; limit: number }) {
    return await this.categoryRepo.getAllCategories(page, limit);
  }
  async getActiveCategory(): Promise<ICategory[]> {
    return await this.categoryRepo.getActiveCategory();
  }

  async createCategory(category: ICategory): Promise<ICategory> {
    return this.categoryRepo.createCategory(category);
  }

  async findById(id: string): Promise<ICategory | null> {
    return this.categoryRepo.findById(id);
  }
  async editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory> {
    return this.categoryRepo.editCategory(id, categoryData);
  }

  async blockCategory(id: string): Promise<void> {
    await this.categoryRepo.blockCategory(id);
  }

  async unblockCategory(id: string): Promise<void> {
    await this.categoryRepo.unblockCategory(id);
  }
}
