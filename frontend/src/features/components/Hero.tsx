 import { Button } from "./Button";
import { ArrowRight, Play, MapPin } from "lucide-react";
import type { IBanner } from "../types/homeTypes";
interface Props{
  banners:IBanner[]
}

const Hero = ({banners}:Props) => {
  // console.log(banners,'banner')
console.log("First Banner:", banners[0]); // Safe access
 
const bannerImage =
  banners && banners.length > 0
    ? banners[0].image.url
    : 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-orange/10 to-orange/5 flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
       //    backgroundImage: "url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          backgroundImage:`url('${bannerImage}')`,
      }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-orange" />
            <span className="text-muted-foreground">Explore the World</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Discover Your Next 
            <span className="text-orange block">Adventure</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore breathtaking destinations, create unforgettable memories, and embark on journeys that will change your perspective forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-orange hover:bg-orange-dark text-white px-8 py-3">
              Explore Packages
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-orange text-orange hover:bg-orange hover:text-white px-8 py-3">
              <Play className="w-4 h-4 mr-2" />
              Watch Video
            </Button>
          </div>
          <div className="flex items-center space-x-6 mt-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white text-sm font-bold">
                50+
              </div>
              <span className="text-muted-foreground">Destinations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white text-sm font-bold">
                5K+
              </div>
              <span className="text-muted-foreground">Happy Travelers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;