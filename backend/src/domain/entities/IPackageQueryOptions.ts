export interface IPackageQueryOptions {
  filters?: any;
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

// interface IPackageQueryOptions {
//   filters?: {
//     category?: string;
//     duration?: string;
//     startDate?: string;
//     endDate?: string;
//   };
//   page?: number;
//   limit?: number;
//   sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
//   search?: string;
// }