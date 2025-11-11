import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/user/Hero';
import PackageCard from '@/components/user/PackageCard';
import { Button } from '@/components/Button';
import { fetchHomeData } from '@/services/user/HomeService';
import { fetchAllPublishedBlog } from '@/services/user/blogService';
import BlogCard from '@/components/user/BlogCard';
import type {  IBanner } from '@/types/homeTypes';
import type { IPackage } from '@/types/IPackage';
import type { IBlog } from '@/types/IBlog';

const Home = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [blogs, setBlogs] = useState<IBlog[]>([]);

  // === Load home data (banners + packages) ===
  useEffect(() => {
    const loadData = async () => {
      try {
        const { result } = await fetchHomeData();
        const { banners, packages } = result;
        console.log(banners,'bannere')
        setBanners(banners);
        setPackages(packages);
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    loadData();
  }, []);

  // === Load published blogs ===
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetchAllPublishedBlog(1, 4, '');
        setBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      {/* === Hero Section === */}
     <Hero
  banners={banners.map((b) => ({
    ...b,
     
  }))}
/>


      {/* === Featured Packages Section === */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Featured <span className="text-orange-600">Packages</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Handpicked experiences designed to create unforgettable journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
              onClick={() => navigate('/packages')}
            >
              View All Packages
            </Button>
          </div>
        </div>
      </section>

      {/* === Blog Section === */}
      {blogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Latest <span className="text-orange-600">Travel Stories</span>
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Get inspired by stories from explorers and travelers around the globe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {blogs.map((blog, index) => (
                <div
                  key={blog._id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BlogCard blog={blog} linkPrefix="/blog" />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                onClick={() => navigate('/blog')}
              >
                View All Blogs
              </Button>
            </div>
          </div>
        </section>
      )}
      {/* <section className="bg-orange-50 py-12 text-center rounded-2xl my-12">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
    ✉️ Stay Updated With Tripsera!
  </h2>
  <p className="text-gray-600 mb-6">
    Subscribe for weekly updates on new destinations and exclusive deals.
  </p>
  <div className="flex justify-center">
    <input
      type="email"
      placeholder="Your email address"
      className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-64"
    />
    <button className="bg-orange text-white px-6 py-2 rounded-r-lg hover:bg-orange-600 text-sm">
      Subscribe
    </button>
  </div>
</section> */}

     </>
  );
};

export default Home;
