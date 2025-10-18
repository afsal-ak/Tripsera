export interface CreateCategoryDTO {
  name: string;
  isBlocked: boolean;
}

export interface UpdateCategoryDTO {
  name?: string;
  isBlocked?: boolean;
}

export interface CategoryResponseDTO {
  _id: string;
  name: string;
  isBlocked: boolean;
}
