import { ICategory } from '@domain/entities/ICategory';
import { IPaginatedResult } from '@domain/entities/IPagination';
import { IFilter } from '@domain/entities/IFilter';
export interface ICategoryUseCases {
  getAllCategory(params: { page: number; limit: number },filter:IFilter): Promise<IPaginatedResult<ICategory>>;

  getActiveCategory(): Promise<ICategory[]>;

  createCategory(category: ICategory): Promise<ICategory>;

  findById(id: string): Promise<ICategory | null>;

  editCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory>;

  blockCategory(id: string): Promise<void>;

  unblockCategory(id: string): Promise<void>;
}
