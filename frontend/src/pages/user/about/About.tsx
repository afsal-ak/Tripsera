import { PlaneTakeoff, Globe2, Users, Heart, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-orange text-white py-20 text-center rounded-b-[3rem] shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Tripsera</h1>
          <p className="text-lg md:text-xl text-orange-50/90 leading-relaxed">
            Your trusted travel companion for discovering breathtaking destinations and unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Travel world"
            className="rounded-2xl shadow-md"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At <span className="font-semibold text-orange">Tripsera</span>, we believe travel is more than just visiting places —
            it’s about creating stories, building connections, and discovering yourself. We curate personalized travel
            experiences across the world, ensuring comfort, safety, and adventure.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With our expert planning and exclusive deals, we help thousands of travelers explore dream destinations
            with ease and elegance.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-10">Our Vision & Mission</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition bg-orange-50">
              <Globe2 className="w-10 h-10 text-orange mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To make world exploration accessible for everyone, connecting travelers to destinations with authenticity and ease.
              </p>
            </div>
            <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition bg-orange-50">
              <Heart className="w-10 h-10 text-orange mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Travel with Passion</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our mission is to turn your travel dreams into cherished memories through premium planning and trusted service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-10">Why Choose Tripsera?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <PlaneTakeoff className="w-8 h-8 text-orange mx-auto mb-3" />, title: "Expert Planning", desc: "We design seamless travel itineraries tailored to your preferences." },
            { icon: <Users className="w-8 h-8 text-orange mx-auto mb-3" />, title: "Trusted by Travelers", desc: "Thousands of happy travelers rely on Tripsera for stress-free journeys." },
            { icon: <MapPinned className="w-8 h-8 text-orange mx-auto mb-3" />, title: "Exclusive Deals", desc: "Enjoy handpicked offers and premium packages you won’t find elsewhere." },
            { icon: <Heart className="w-8 h-8 text-orange mx-auto mb-3" />, title: "24/7 Support", desc: "Our travel experts are always here to help — before, during, and after your trip." },
          ].map(({ icon, title, desc }, index) => (
            <div key={index} className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
              {icon}
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange text-white py-16 text-center rounded-t-[3rem] shadow-inner">
        <h2 className="text-3xl font-semibold mb-4">Start Your Journey with Tripsera</h2>
        <p className="text-orange-50/90 mb-8 text-lg">
          Explore handpicked destinations and create moments that last a lifetime.
        </p>
        <Link
          to="/packages"
          className="bg-white text-orange font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-orange-50 transition"
        >
          Explore Packages
        </Link>
      </section>
    </div>
  );
}
