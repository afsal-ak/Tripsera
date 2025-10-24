import { useEffect, useState } from 'react';
import { fetchUserCustomPackages } from '@/services/user/customPkgService';
import PackageCard from '@/components/user/PackageCard';
import type { IPackage } from '@/types/IPackage';

const UserCustomPackagesPage = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const loadPackages = async () => {
    try {
      const res = await fetchUserCustomPackages(page, limit);
      setPackages(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load custom packages', err);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [page]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Your Custom Packages</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length > 0 ? (
          packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
        ) : (
          <p className="text-muted-foreground">No custom packages found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded border bg-orange text-white hover:bg-orange/90 disabled:bg-gray-200 disabled:text-gray-500"
        >
          Prev
        </button>

        <span className="px-2 text-sm">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded border bg-orange text-white hover:bg-orange/90 disabled:bg-gray-200 disabled:text-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserCustomPackagesPage;
