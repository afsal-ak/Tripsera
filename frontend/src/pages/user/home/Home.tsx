import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/user/Hero';
import PackageCard from '@/components/user/PackageCard';
import { Button } from '@/components/Button';
import { fetchHomeData, fetchTopBookedPackages } from '@/services/user/HomeService';
import { fetchAllPublishedBlog } from '@/services/user/blogService';
import BlogCard from '@/components/user/BlogCard';
import type { IBanner } from '@/types/homeTypes';
import type { IPackage } from '@/types/IPackage';
import type { IBlog } from '@/types/IBlog';
import { subscribeToNewsletterToggle } from '@/services/user/newsLetterService';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { setUser } from '@/redux/slices/userAuthSlice';

const Home = () => {
  const navigate = useNavigate();
  const isSubscribedFromStore = useSelector((state: RootState) => state.userAuth.user?.isNewsletterSubscribed);
  const accessToken = useSelector((state: RootState) => state.userAuth.accessToken);

  const dispatch = useDispatch<AppDispatch>();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(isSubscribedFromStore || false);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [blogs, setBlogs] = useState<IBlog[]>([]);

  // === Load home data (banners + packages) ===
  useEffect(() => {
    const loadData = async () => {
      try {
        const { result } = await fetchHomeData();
        const { banners, packages } = result;
        console.log(banners, 'bannere')
        setBanners(banners);
        //setPackages(packages);
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadPkgData = async () => {
      try {
        const result = await fetchTopBookedPackages();
        console.log(result, 'top booked packages');
        setPackages(result);
      } catch (error) {
        console.error('Failed to load home data:', error);
      }
    };
    loadPkgData();
  }, []);
  console.log(packages, 'pkgsgs');

  useEffect(() => {
    // Keep in sync with global redux user updates
    setIsSubscribed(isSubscribedFromStore || false);
  }, [isSubscribedFromStore]);

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

  const handleNewsletterToggle = async () => {
    if (!accessToken) {
      toast.info("Please log in to subscribe to the newsletter.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    try {
      const response = await subscribeToNewsletterToggle(!isSubscribed);
      console.log(response, 'response');

      setIsSubscribed(!isSubscribed);
      dispatch(
        setUser({
          user: {
            ...response.data,
            isNewsletterSubscribed: !isSubscribed,

          },
          accessToken: accessToken!,
        })
      );
      // dispatch({
      //   type: 'userAuth/setUser',
      //   payload: {
      //     user: {
      //       ...response.data.user,
      //       isNewsletterSubscribed: !isSubscribed,
      //     },
      //     accessToken: '', // No need to update accessToken here
      //   },
      // });
      toast.success(
        !isSubscribed
          ? "Subscribed to newsletter successfully "
          : "Unsubscribed from newsletter."
      );
    } catch (error) {
      console.error('Failed to toggle newsletter:', error);
      toast.error('Failed to update subscription.');
    }
  };

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
      {/* === Newsletter Subscription Section === */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16 my-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="bg-white shadow-xl rounded-3xl p-10 md:p-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ✉️ Stay in the Loop with <span className="text-orange-600">Tripsera</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Get weekly travel inspiration, top-rated packages, and exclusive subscriber-only offers — straight to your inbox.
            </p>

            {/* === Feature Highlights === */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 p-4 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-700">Weekly Top Packages</h4>
                <p className="text-gray-500 text-sm mt-1">Discover our most booked destinations every week.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-orange-100 p-4 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-700">Exclusive Offers</h4>
                <p className="text-gray-500 text-sm mt-1">Be the first to know about discounts and deals.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-orange-100 p-4 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3 1.343 3 3S13.657 14 12 14 9 12.657 9 11s1.343-3 3-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15A7.97 7.97 0 0112 20a7.97 7.97 0 01-7.4-5" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-700">Travel Inspiration</h4>
                <p className="text-gray-500 text-sm mt-1">Explore blogs and stories that spark your wanderlust.</p>
              </div>
            </div>

            {/* === Subscribe Button === */}
            <button
              onClick={handleNewsletterToggle}
              className={`px-8 py-3 text-lg font-semibold rounded-full transition-colors shadow-md ${isSubscribed
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-orange hover:bg-orange-700 text-white"
                }`}
            >
              {isSubscribed ? "Unsubscribe from Newsletter" : "Subscribe Now"}
            </button>
          </div>
        </div>
      </section>


    </>
  );
};

export default Home;
