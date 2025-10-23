import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { ICategoryUseCases } from '@application/useCaseInterfaces/admin/ICategoryUseCases';
import { IFilter } from '@domain/entities/IFilter';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryResponseDTO,
} from '@application/dtos/CategoryDTO';
import { PaginatedResult } from '@domain/entities/IPaginatedResult';
import { CategoryMapper } from '@application/mappers/CategoryMapper';

export class CategoryUseCases implements ICategoryUseCases {
  constructor(private _categoryRepo: ICategoryRepository) {}

  async getAllCategory(
    { page, limit }: { page: number; limit: number },
    filters: IFilter
  ): Promise<PaginatedResult<CategoryResponseDTO>> {
    const result = await this._categoryRepo.getAllCategories(page, limit, filters);
    return {
      data: result.data.map(CategoryMapper.toResponseDTO),
      pagination: result.pagination,
    };
  }
   
  async getActiveCategory(): Promise<CategoryResponseDTO[]> {
    const cat = await this._categoryRepo.getActiveCategory();
    return cat.map(CategoryMapper.toResponseDTO);
  }

  async createCategory(category: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const cat = await this._categoryRepo.createCategory(category);
    return CategoryMapper.toResponseDTO(cat);
  }

  async findById(id: string): Promise<CategoryResponseDTO | null> {
    const cat = await this._categoryRepo.findById(id);
    return cat ? CategoryMapper.toResponseDTO(cat) : null;
  }
  async editCategory(id: string, categoryData: UpdateCategoryDTO): Promise<CategoryResponseDTO> {
    const cat = await this._categoryRepo.editCategory(id, categoryData);
    return CategoryMapper.toResponseDTO(cat);
  }

  async blockCategory(id: string): Promise<void> {
    await this._categoryRepo.blockCategory(id);
  }

  async unblockCategory(id: string): Promise<void> {
    await this._categoryRepo.unblockCategory(id);
  }
}
