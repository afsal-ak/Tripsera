

// import React, { useEffect, useState } from "react";
// import Navbar from "@/features/components/Navbar";
// import Footer from "@/features/components/Footer";
// import PackageFilterSidebar from "@/features/components/PackageFilterSidebar";
// import PackageCard from "@/features/components/PackageCard";
// import type { IPackage } from "@/features/types/homeTypes";
// import { fetchActivePackages } from "@/features/services/user/PackageService";
// import { useSearchParams } from "react-router-dom";

// const validSortValues = ["newest", "oldest", "price_asc", "price_desc"] as const;
// type SortType = typeof validSortValues[number];

// const Packages = () => {
//   const [packages, setPackages] = useState<IPackage[]>([]);
//   const [totalPages, setTotalPages] = useState(1);

//   const [searchParams, setSearchParams] = useSearchParams();

//   const page = parseInt(searchParams.get("page") || "1");
//   const limit = 9;

//   const rawSort = searchParams.get("sort") || "newest";
//   const sort: SortType = validSortValues.includes(rawSort as SortType)
//     ? (rawSort as SortType)
//     : "newest";

//   const location = searchParams.get("location") || "";
//   const category = searchParams.get("category") || "";
//   const duration = searchParams.get("duration") || "";

//   const filters: Record<string, string> = {};
//   if (location) filters.location = location;
//   if (category) filters.category = category;
//   if (duration) filters.duration = duration;

//   const loadPackages = async () => {
//     try {
//       const res = await fetchActivePackages({
//         filters,
//         sort,
//         page,
//         limit,
//       });
//       setPackages(res.data);
//       setTotalPages(res.totalPages);
//     } catch (error) {
//       console.error("Failed to load packages", error);
//     }
//   };

//   useEffect(() => {
//     loadPackages();
//   }, [searchParams]);

//   const handleFilterChange = (newFilters: any) => {
//     const current = Object.fromEntries(searchParams.entries());
//     const newParams = {
//       ...current,
//       ...newFilters,
//       page: "1", // reset to first page
//     };
//     setSearchParams(newParams);
//   };

//   const handleClear = () => {
//     setSearchParams({ page: "1" });
//   };

//   const goToPage = (newPage: number) => {
//     const current = Object.fromEntries(searchParams.entries());
//     setSearchParams({ ...current, page: String(newPage) });
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="bg-background min-h-screen py-8">
//         <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
//           <PackageFilterSidebar
//             filters={{ location, category, duration, sort }}
//             onFilterChange={handleFilterChange}
//             onClear={handleClear}
//           />
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold mb-6 text-foreground">Available Packages</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {packages.length > 0 ? (
//                 packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
//               ) : (
//                 <p className="text-muted-foreground">No packages found.</p>
//               )}
//             </div>
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={() => goToPage(page - 1)}
//                 disabled={page === 1}
//                 className="mx-2 px-4 py-2 bg-gray-300 dark:bg-border text-black dark:text-white rounded"
//               >
//                 Prev
//               </button>
//               <span className="text-foreground">Page {page} of {totalPages}</span>
//               <button
//                 onClick={() => goToPage(page + 1)}
//                 disabled={page === totalPages}
//                 className="mx-2 px-4 py-2 bg-gray-300 dark:bg-border text-black dark:text-white rounded"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Packages;
import React, { useState, useEffect } from "react";
import Navbar from "@/features/components/Navbar";
import Footer from "@/features/components/Footer";
import PackageFilterSidebar from "@/features/components/PackageFilterSidebar";
import PackageCard from "@/features/components/PackageCard";
import type { IPackage } from "@/features/types/homeTypes";
import { fetchActivePackages } from "@/features/services/user/PackageService";
import { useSearchParams } from "react-router-dom";

const Packages = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();

  // const filters = {
  //   location: searchParams.get("location") || "",
  //   category: searchParams.get("category") || "",
  //   duration: searchParams.get("duration") || "",
  //   sort: (searchParams.get("sort") || "newest") as
  //     | "newest"
  //     | "oldest"
  //     | "price_asc"
  //     | "price_desc",
  //   search: searchParams.get("search") || "",
  // };
const filters = {
  location: searchParams.get("location") || "",
  category: searchParams.get("category") || "",
  duration: searchParams.get("duration") || "",
  sort: (searchParams.get("sort") || "newest") as
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc",
  search: searchParams.get("search") || "",
  startDate: searchParams.get("startDate") || "",  // ✅ Add this
  endDate: searchParams.get("endDate") || "",      // ✅ Add this
};

  const currentPage = parseInt(searchParams.get("page") || "1");

  const loadPackages = async () => {
    try {
      const res = await fetchActivePackages({
        page: currentPage,
        limit: 3,
        location: filters.location,
        category: filters.category,
        duration: filters.duration,
        sort: filters.sort,
        search: filters.search,
         startDate: filters.startDate, // ✅ Add this
  endDate: filters.endDate,     // ✅ Add this
      });

      setPackages(res.data);
      setTotalPages(res.totalPages);
      setPage(currentPage);
    } catch (error) {
      console.error("Failed to load packages", error);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [searchParams]);

  const handleFilterChange = (newFilters: any) => {
    setSearchParams({
      ...newFilters,
      page: "1",
    });
  };

  const handleClear = () => {
    setSearchParams({ page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      ...filters,
      page: String(newPage),
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
          <PackageFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClear}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Available Packages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))
              ) : (
                <p className="text-muted-foreground">No packages found.</p>
              )}
            </div>
            {/* <div className="flex justify-center mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="mx-2 px-4 py-2 bg-gray-300 dark:bg-border text-black dark:text-white rounded"
              >
                Prev
              </button>
              <span className="text-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="mx-2 px-4 py-2 bg-gray-300 dark:bg-border text-black dark:text-white rounded"
              >
                Next
              </button>
            </div> */}

<div className="flex justify-center mt-6 items-center gap-2">
  <button
    onClick={() => handlePageChange(page - 1)}
    disabled={page === 1}
    className={`px-3 py-1.5 text-sm rounded border ${
      page === 1
        ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-border"
        : "bg-orange text-white hover:bg-orange/90"
    }`}
  >
    Prev
  </button>

  <span className="text-sm text-foreground px-2">
    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
  </span>

  <button
    onClick={() => handlePageChange(page + 1)}
    disabled={page === totalPages}
    className={`px-3 py-1.5 text-sm rounded border ${
      page === totalPages
        ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-border"
        : "bg-orange text-white hover:bg-orange/90"
    }`}
  >
    Next
  </button>
</div>


          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Packages;
