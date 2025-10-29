export interface IPackageFilter {
  search?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  category?: string;
  duration?: string | number;
  startDate?: string;
  endDate?: string;
}
