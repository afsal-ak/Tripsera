export interface IFilter {
  page?:number,
  limit?:number,
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?:string
  rating?:string
}