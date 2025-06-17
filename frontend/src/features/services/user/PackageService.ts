import type { IPackage } from "@/features/types/homeTypes";
import api from "@/lib/axios";


interface PackageQueryParams {
  location?: string;
  category?: string;
  duration?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
  search?: string;
  startDate?:string,
  endDate?:string,
}

export const fetchActivePackages =async(params:PackageQueryParams):Promise<{
      data: IPackage[];
  total: number;
  currentPage: number;
  totalPages: number;

}>=>{
    const res=await api.get('/packages',{params})
    return res.data
}

export const fetchPackgeById=async(id:string):Promise<IPackage>=>{
    const res=await api.get(`/packages/${id}`)
    return res.data.packages
}