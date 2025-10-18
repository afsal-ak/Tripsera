import { useEffect, useState } from 'react';
import type { IPackage, IBanner } from '@/types/homeTypes';

import Hero from '../../../components/user/Hero';
import { Button } from '../../../components/Button';
import PackageCard from '@/components/user/PackageCard';
import { fetchHomeData } from '@/services/user/HomeService';
const Home = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { result } = await fetchHomeData();
        const { banners, packages } = result;
        console.log('Banners:', banners);
        //         console.log("Packages:", packages);
        setBanners(banners);
        setPackages(packages);
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Hero banners={banners} />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured <span className="text-orange">Packages</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of extraordinary travel experiences designed to
              create memories that last a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-orange text-orange hover:bg-orange hover:text-white"
            >
              View All Packages
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
