import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IBooking } from "@/features/types/IBooking";
import { getBookingById } from "@/features/services/user/bookingService";

const BookingSuccessPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await getBookingById(id!);
        setBooking(res.booking);
      } catch (err) {
        console.error("Failed to fetch booking", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadBooking();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading booking details...</div>;
  if (!booking) return <div className="text-center py-10 text-red-500">Booking not found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">🎉 Booking Confirmed!</h1>
        <p className="text-gray-500 mt-1">Thank you for your booking. Your details are below:</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-gray-700">
        <div>
          <span className="font-medium text-gray-900">Booking ID:</span> <br />
          <span>{booking._id}</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Package:</span> <br />
          <span>{typeof booking.packageId === 'object' ? booking.packageId.title : ''}</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Travel Date:</span> <br />
{booking?.travelDate && (
  <span>
    {new Date(booking.travelDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </span>
)}
        </div>
        <div>
          <span className="font-medium text-gray-900">Amount Paid:</span> <br />
          <span>₹{booking.amountPaid}</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Payment Method:</span> <br />
          <span className="capitalize">{booking.paymentMethod}</span>
        </div>
        <div>
          <span className="font-medium text-gray-900">Booking Status:</span> <br />
          <span className="capitalize">{booking.bookingStatus}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Traveler Details</h3>
        <ul className="space-y-2 pl-4 list-disc text-sm text-gray-700">
          {booking.travelers.map((traveler, idx) => (
            <li key={idx}>
              {traveler.fullName} ({traveler.gender}, Age: {traveler.age})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
