import { Request,Response } from "express";
import { HomeUseCases } from "@domain/usecases/user/homeUseCases";
import { PackageUseCases } from "@domain/usecases/admin/packageUseCases";

export class HomeController{
    constructor(
      private homeUseCases:HomeUseCases,
      ){}


    getHome=async(req:Request,res:Response):Promise<void>=>{
        try {
            const result=await this.homeUseCases.getHome()
          //  console.log(result.banners)
            //console.log("Sent Banners to frontend:", JSON.stringify(result.banners, null, 2));

       res.status(200).json({ result});

     // res.status(200).json({ result:'hello'});
        } catch (error:any) {
          res.status(400).json({ message: error.message });

        }
    }

getActivePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, sort, search, ...restFilters } = req.query;
console.log("Query received:", req.query);

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 9;
    const sortBy = (sort as string) || "newest";
    const searchQuery = (search as string) || "";

    const rawFilters = restFilters;
    const filters: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawFilters)) {
      if (value && typeof value === "string" && value.trim() !== "") {
        filters[key] = value.trim();
      }
    }

    console.log("Query received:", req.query);
    console.log("Final cleaned filters:", filters);
    console.log("Search query:", searchQuery);

    const result = await this.homeUseCases.getActivePackage({
      filters,
      page: pageNum,
      limit: limitNum,
      sort: sortBy,
      search: searchQuery,
    });
console.log(search,'search')
    res.status(200).json({
      message: "Active packages fetched successfully",
      ...result,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Something went wrong" });
  }
};

    getPackagesById=async(req:Request,res:Response):Promise<void>=>{
        try {
            const {id}=req.params
          const packages=await this.homeUseCases.getPackageById(id)
             // console.log(packages,'pkg')

          res.status(200).json({message:'Package fetched successfully',packages})

        } catch (error:any) {
           res.status(500).json({ message: error.message || "Something went wrong" });

        }
     }

}


