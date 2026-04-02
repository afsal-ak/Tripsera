import { PlaneTakeoff } from "lucide-react";

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-white">

    {/* Animated Plane */}
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-orange-200 blur-xl opacity-40 rounded-full animate-pulse" />
      
      <PlaneTakeoff className="w-14 h-14 text-orange-500 animate-bounce" />
    </div>

    {/* Brand */}
    <h1 className="text-3xl font-semibold text-gray-800 tracking-wide">
      Tripsera
    </h1>

    {/* Loading text */}
    <p className="text-sm text-gray-500 mt-2">
      Preparing your journey...
    </p>

    {/* Progress bar */}
    <div className="w-40 h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
      <div className="h-full bg-orange-500 animate-[loading_1.5s_infinite]" />
    </div>

  </div>
);

export default Loader;

// const Loader: React.FC = () => (
//   <div className="flex flex-col items-center justify-center h-screen bg-white text-orange-500">
//     <div className="w-14 h-14 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mb-4" />

//     <h1 className="text-2xl font-bold tracking-wide animate-pulse">Tripsera</h1>

//     <p className="text-sm text-gray-400 mt-1">Loading your adventure...</p>
//   </div>
// );
// export default Loader;
