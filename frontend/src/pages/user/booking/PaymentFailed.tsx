import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, PlaneTakeoff } from 'lucide-react';
import { Button } from '@/components/Button';

export default function PaymentFailed() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-red-50 min-h-screen">

      {/* 🔥 HERO SECTION */}
      <div className="bg-red-500 text-white py-16 text-center rounded-b-[3rem] shadow-lg">
        <PlaneTakeoff className="w-16 h-16 mx-auto mb-3 opacity-80 animate-pulse" />
        <AlertTriangle className="w-14 h-14 mx-auto mb-3 text-white" />

        <h1 className="text-3xl font-bold">Payment Failed</h1>
        <p className="text-red-100 mt-2">
          Oops! Something went wrong with your booking
        </p>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border">

          <p className="text-gray-700">
            Your booking could not be completed. This may be due to:
          </p>

          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Payment cancelled</li>
            <li>• Network issue</li>
            <li>• Insufficient balance</li>
          </ul>

          <div className="pt-4 border-t">
            <span className="text-gray-500 text-sm">Booking ID</span>
            <p className="font-semibold text-gray-800">{id}</p>
          </div>

        </div>

        {/* 🔥 ACTION BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

          <Button
            onClick={() => navigate(-1)}
            className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600 transition"
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/packages')}
            className="border-red-500 text-red-500 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition"
          >
            Explore Packages
          </Button>

        </div>
      </div>
    </div>
  );
}
// import { useParams, Link } from 'react-router-dom';
// import { AlertTriangle } from 'lucide-react';

// export default function PaymentFailed() {
//   const { id } = useParams();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
//       <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
//         <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4" />
//         <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
//         <p className="text-gray-700 mb-4">
//           Something went wrong with your payment. Your booking ID: <strong>{id}</strong>
//         </p>
//         <Link to="/book" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
//           Try Again
//         </Link>
//       </div>
//     </div>
//   );
// }
