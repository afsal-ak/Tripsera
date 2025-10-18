const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white text-orange-500">
    <div className="w-14 h-14 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mb-4" />

    <h1 className="text-2xl font-bold tracking-wide animate-pulse">Tripsera</h1>

    <p className="text-sm text-gray-400 mt-1">Loading your adventure...</p>
  </div>
);
export default Loader;
