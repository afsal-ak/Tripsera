import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 text-center px-4">

      {/* ✈️ Icon */}
      <Plane className="text-orange-400 mb-4" size={42} />

      {/* 404 */}
      <h1 className="text-7xl font-bold text-orange mb-2">404</h1>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-500 max-w-md mb-6">
        Sorry, the page you are looking for doesn’t exist or may have been moved.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium 
          bg-white hover:bg-gray-50 hover:shadow-sm 
          active:scale-95 transition-all duration-150"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium 
          shadow-sm hover:shadow-md hover:bg-orange-dark 
          active:scale-95 transition-all duration-150"
        >
          Home Page
        </button>

      </div>

    </div>
  );
};

export default NotFoundPage;
