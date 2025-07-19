import { useParams, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function PaymentFailed() {
  const { id } = useParams(); 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="bg-red-100 p-6 rounded-lg shadow-md text-center">
        <AlertTriangle className="text-red-600 w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
        <p className="text-gray-700 mb-4">
          Something went wrong with your payment. Your booking ID: <strong>{id}</strong>
        </p>
        <Link
          to="/book"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
