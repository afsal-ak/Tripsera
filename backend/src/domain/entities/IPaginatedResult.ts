import { PaginationInfo } from "@application/dtos/PaginationDto";

 export interface IPaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}
