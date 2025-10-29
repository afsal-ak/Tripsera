import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { ArrowRight, Play, MapPin } from 'lucide-react';
import type { IBanner } from '../../types/homeTypes';
import { useNavigate } from 'react-router-dom';

interface Props {
  banners: IBanner[];
}

const Hero = ({ banners }: Props) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if no banners
  const fallbackImage =
    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentIndex] || {
    title: 'Discover Your Next Adventure',
    description: 'Find unforgettable destinations and curated travel experiences.',
    image: { url: fallbackImage },
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background images with smooth fade */}
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner.image?.url || fallbackImage}
            alt={banner.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="max-w-2xl animate-fade-in">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-orange" />
            <span className="text-gray-200">Explore the World</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {currentBanner.title || 'Discover Your Next'}
            <span className="text-orange block">Adventure</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {currentBanner.description ||
              'Explore breathtaking destinations and unforgettable journeys.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange hover:bg-orange-dark text-white px-8 py-3"
              onClick={() => navigate('/packages')}
            >
              Explore Packages
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-orange text-orange hover:bg-orange hover:text-white px-8 py-3"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </Button>
          </div>
        </div>

        {/* Dots for manual navigation */}
        {banners.length > 1 && (
          <div className="flex justify-center mt-10 space-x-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-orange scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
