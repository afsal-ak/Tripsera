import { useEffect, useState } from 'react';
import { fetchUserCustomPackages } from '@/services/user/customPkgService';
import PackageCard from '@/components/user/PackageCard';
import type { IPackage } from '@/types/IPackage';
import { usePaginationButtons } from '@/hooks/usePaginationButtons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const UserCustomPackagesPage = () => {
  const navigate = useNavigate()
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
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">

  {/* 🧳 Icon */}
  <div className="text-5xl mb-4">🧳</div>

  {/* Heading */}
  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
    No Custom Packages Yet
  </h3>

  {/* Description */}
  <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-md">
    You haven’t requested a custom travel package yet. 
    Tell us your preferences and we’ll create a personalized trip just for you.
  </p>

  {/* CTA Buttons */}
  <div className="flex gap-3 mt-5 flex-wrap justify-center">

    {/* 🔥 MAIN CTA */}
    <button
      onClick={() => navigate('/custom-package')}
      className="px-5 py-2.5 bg-orange text-white rounded-lg text-sm font-medium hover:bg-orange-dark transition"
    >
      Request Custom Package
    </button>

    {/* Optional secondary */}
    <button
      onClick={() => navigate('/packages')}
      className="px-5 py-2.5 border rounded-lg text-sm hover:bg-gray-100 transition"
    >
      Browse Packages
    </button>

  </div>
</div>
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
