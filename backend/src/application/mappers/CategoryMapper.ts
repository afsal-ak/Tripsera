import { ICategory } from '@domain/entities/ICategory';
import { CategoryResponseDTO } from '@application/dtos/CategoryDTO';

export class CategoryMapper {
  static toResponseDTO(category: ICategory): CategoryResponseDTO {
    return {
      _id: category._id!.toString(),
      name: category.name,
      isBlocked: category.isBlocked,
    };
  }
}
