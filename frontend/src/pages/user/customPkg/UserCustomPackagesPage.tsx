import { useEffect, useState } from 'react';
import { fetchUserCustomPackages } from '@/services/user/customPkgService';
import PackageCard from '@/components/user/PackageCard';
import type { IPackage } from '@/types/IPackage';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { useSearchParams } from 'react-router-dom';

const UserCustomPackagesPage = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '3', 10);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  const loadPackages = async () => {
    try {
      const res = await fetchUserCustomPackages(currentPage, limit);
      setPackages(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load custom packages', err);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [searchParams]);

  const paginationButtons = usePaginationButtons({
    currentPage,
    totalPages,
    onPageChange: handlePageChange,
  });

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:container lg:mx-auto py-4 sm:py-6 md:py-8">
      
      {/* Heading */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
        Your Custom Packages
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <div className="w-full">
              <PackageCard key={pkg._id} pkg={pkg} />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center col-span-full text-sm sm:text-base">
            No custom packages found.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6 flex-wrap">
        {paginationButtons}
      </div>

    </div>
  );
};

export default UserCustomPackagesPage;
// import { useEffect, useState } from 'react';
// import { fetchUserCustomPackages } from '@/services/user/customPkgService';
// import PackageCard from '@/components/user/PackageCard';
// import type { IPackage } from '@/types/IPackage';
// import { usePaginationButtons } from '@/hooks/usePaginationButtons';
// import { useSearchParams } from 'react-router-dom';

// const UserCustomPackagesPage = () => {
//   const [packages, setPackages] = useState<IPackage[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchParams, setSearchParams] = useSearchParams();

//   const currentPage = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '3', 10);

//   const handlePageChange = (page: number) => {
//     setSearchParams({ page: page.toString(), limit: limit.toString() });
//   };
//   const loadPackages = async () => {
//     try {
//       const res = await fetchUserCustomPackages(currentPage, limit);
//       setPackages(res.data);
//       setTotalPages(res.pagination.totalPages);
//     } catch (err) {
//       console.error('Failed to load custom packages', err);
//     }
//   };

//   useEffect(() => {
//     loadPackages();
//   }, [searchParams]);
//   const paginationButtons = usePaginationButtons({
//     currentPage,
//     totalPages,
//     onPageChange: handlePageChange,
//   });
//   return (
//     <div className="container mx-auto py-8">
//       <h2 className="text-2xl font-bold mb-6">Your Custom Packages</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {packages.length > 0 ? (
//           packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
//         ) : (
//           <p className="text-muted-foreground">No custom packages found.</p>
//         )}
//       </div>

//        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
//         {paginationButtons}
//       </div>
//     </div >
//   );
// };

// export default UserCustomPackagesPage;
