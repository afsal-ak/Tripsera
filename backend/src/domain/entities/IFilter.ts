export interface IFilter {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?:string;
  rating?:number
  customFilter?:string;
}