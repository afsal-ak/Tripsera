import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, PlaneTakeoff } from 'lucide-react';

import { Button } from '@/components/Button';
import type { IBooking } from '@/types/IBooking';
import { getBookingById } from '@/services/user/bookingService';

const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await getBookingById(id!);
        setBooking(res.booking);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="bg-orange-50 min-h-screen">

      {/* HERO */}
      <div className="bg-orange text-white py-16 text-center rounded-b-[3rem] shadow-lg">
        <PlaneTakeoff className="w-16 h-16 mx-auto mb-3 animate-bounce" />
        <CheckCircle2 className="w-14 h-14 mx-auto mb-3 text-green-200" />

        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-orange-50 mt-2">
          Your journey is ready ✈️
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {booking.packageId.title}
          </h2>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">

          <div className="flex justify-between">
            <span>Booking ID</span>
            <span className="font-semibold">{booking.bookingCode}</span>
          </div>

          <div className="flex justify-between">
            <span>Travel Date</span>
            <span>
              {new Date(booking.bookedAt!).toLocaleDateString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Travelers</span>
            <span>{booking.travelers.length}</span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{booking.totalAmount}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{booking.discount}</span>
          </div>

          <div className="flex justify-between font-bold text-orange">
            <span>Paid</span>
            <span>₹{booking.amountPaid}</span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => navigate(`/account/my-bookings/${id}`)}
            className="bg-orange text-white px-6 py-3 rounded-xl"
          >
            View Booking
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/packages')}
            className="border-orange text-orange px-6 py-3 rounded-xl"
          >
            Explore Trips
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { Package, CheckCircle2 } from 'lucide-react';

// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/Button';
// import type { IBooking } from '@/types/IBooking';
// import { getBookingById } from '@/services/user/bookingService';

// const BookingSuccessPage = () => {
//   const navigate = useNavigate();

//   const { id } = useParams();
//   const [booking, setBooking] = useState<IBooking | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadBooking = async () => {
//       try {
//         const res = await getBookingById(id!);
//         setBooking(res.booking);
//       } catch (err) {
//         console.error('Failed to fetch booking', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) loadBooking();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent mx-auto"></div>
//           <p className="text-muted-foreground font-poppins">Loading your booking details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <Card className="max-w-md w-full mx-4 shadow-md">
//           <CardContent className="text-center py-8">
//             <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Package className="w-8 h-8 text-destructive" />
//             </div>
//             <h2 className="text-xl font-semibold text-foreground mb-2 font-poppins">
//               Booking Not Found
//             </h2>
//             <p className="text-muted-foreground">
//               We couldn't find the booking you're looking for.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10 text-center">
//       <CheckCircle2 className="text-green-600 w-20 h-20 mb-4" />
//       <h1 className="text-3xl font-semibold text-gray-800 mb-2">Booking Confirmed!</h1>
//       <p className="text-gray-600 mb-6 max-w-md">
//         Thank you for booking <span className="font-medium">{booking.packageId.title}</span>. A
//         confirmation email has been sent. Below is your booking summary:
//       </p>

//       <div className="bg-gray-100 w-full max-w-md p-6 rounded-xl shadow-md text-left mb-6">
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Booking ID:</span>
//           <span className="text-gray-900">{booking.bookingCode}</span>
//         </div>
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Travel Date:</span>
//           {booking?.bookedAt && (
//             <span>
//               {new Date(booking?.bookedAt).toLocaleDateString('en-IN', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//               })}
//             </span>
//           )}
//         </div>
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Travelers:</span>
//           <span className="text-gray-900">{booking.travelers.length}</span>
//         </div>
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Total Amount:</span>
//           <span className="text-gray-900">₹{booking.totalAmount.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Discount:</span>
//           <span className="text-gray-900">₹{booking?.discount!.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between mb-2">
//           <span className="font-medium text-gray-700">Amount Paid:</span>
//           <span className="text-green-600 font-semibold">₹{booking.amountPaid.toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="font-medium text-gray-700">Payment Method:</span>
//           <span className="capitalize text-gray-900">{booking.paymentMethod}</span>
//         </div>
//       </div>

//       <Button
//         className="px-6 py-3 text-base bg"
//         onClick={() => navigate(`/account/my-bookings/${id}`)}
//       >
//         View My Booking
//       </Button>
//     </div>
//   );
// };

// export default BookingSuccessPage;
