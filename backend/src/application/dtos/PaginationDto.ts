export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export function createPaginationDTO(
  totalItems: number,
  currentPage: number,
  pageSize: number
): PaginationInfo {
  return {
    currentPage,
    totalPages: Math.ceil(totalItems / pageSize),
    pageSize,
    totalItems,
  };
}
