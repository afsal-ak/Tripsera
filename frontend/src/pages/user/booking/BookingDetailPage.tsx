// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Separator } from '@/components/ui/separator';
// import { Button } from '@/components/Button';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
// import { getBookingById, cancelBooking, downloadInvoice } from '@/services/user/bookingService';
// import { fetchPackgeById } from '@/services/user/PackageService';
// import type { IPackage } from '@/types/IPackage';
// import type { IBooking } from '@/types/IBooking';
// import { RetryPaymentModal } from './RetryPaymentModal';
// import { DownloadIcon,Check } from 'lucide-react';
// const BookingDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState<IBooking | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');
//   const [showRetryModal, setShowRetryModal] = useState(false);
//   const [pkg, setPkg] = useState<IPackage | null>(null);

//   useEffect(() => {
//     const loadBooking = async () => {
//       try {
//         const data = await getBookingById(id!);
//         setBooking(data.booking);
//         console.log(data, 'data')
//       } catch {
//         toast.error('Failed to load booking.');
//         navigate('/account/bookings');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) loadBooking();
//   }, [id,]);

//   const pkgId=booking?.packageId._id
//   useEffect(() => {
//     const loadPackage = async () => {
//       if (!pkgId) {
//         return;
//       }
//       try {
//         const data = await fetchPackgeById(pkgId);
//         console.log(data,'pkg data')
//         setPkg(data);
//       } catch (error) {
//         console.error('Failed to fetch package details', error);
//       }
//     };
//     loadPackage();
//   }, [pkgId]);


//   const handleCancel = async () => {
//     if (!cancelReason.trim()) {
//       toast.error('Please provide a cancellation reason.');
//       return;
//     }

//     try {
//       await cancelBooking(id!, cancelReason);
//       console.log(cancelReason, 'reason');
//       toast.success('Booking cancelled.');

//       setBooking((prev) =>
//         prev
//           ? {
//             ...prev,
//             bookingStatus: 'cancelled',
//             updatedAt: new Date(),
//           }
//           : prev
//       );
//       setOpen(false);
//     } catch {
//       toast.error('Cancellation failed.');
//     }
//   };


//   const handleDownloadInvoice = async () => {
//     setLoading(true)
//     try {

//       const response = await downloadInvoice(booking?._id!)


//     } catch (error) {
//       console.error("Error downloading invoice", error);
//       toast.error("Failed to download invoice. Please try again.");
//     } finally {
//       setLoading(false)
//     }
//   };
//   const packageId = booking?.packageId._id
//   const handleAddReview = () => {
//     navigate(`/packages/${packageId}/review/add`);
//   };


//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <Card className="shadow-md rounded-2xl border border-gray-200">
//         <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
//           <CardTitle className="text-2xl font-bold text-gray-800">Booking Details</CardTitle>

//           {/* Left-aligned action buttons */}
//           <div className="flex justify-start sm:justify-end w-full sm:w-auto">
//             <button
//               disabled={loading}
//               onClick={handleDownloadInvoice}
//               className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200 shadow-sm ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//                 } text-white`}
//             >
//               <DownloadIcon size={18} />
//               {loading ? "Downloading..." : "Download Invoice"}
//             </button>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6 text-sm text-gray-700">
//           {/* Package Image */}
//           {booking?.packageId?.imageUrls?.[0]?.url && (
//             <img
//               src={booking?.packageId.imageUrls[0].url.replace("/upload/", "/upload/f_auto,q_auto/")}
//               alt={booking?.packageId.title}
//               className="w-full h-56 object-cover rounded-xl border border-gray-200"
//             />
//           )}

//           {/* Booking Summary */}
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-3 text-lg">Booking Summary</h4>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
//               <p><strong>Booking Code:</strong> {booking?.bookingCode}</p>
//               <p><strong>Package Code:</strong> {booking?.packageId.packageCode}</p>
//               <p><strong>Package:</strong> {booking?.packageId?.title}</p>
//               <p>
//                 <strong>Travel Date:</strong>{" "}
//                 {booking?.travelDate
//                   ? new Date(booking?.travelDate).toLocaleDateString("en-IN", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })
//                   : "—"}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 <span
//                   className={`font-medium ${booking?.bookingStatus === "cancelled" ? "text-red-500" : "text-green-600"
//                     }`}
//                 >
//                   {booking?.bookingStatus}
//                 </span>
//               </p>
//               <p><strong>Payment:</strong> ₹{booking?.amountPaid} ({booking?.paymentStatus})</p>
//               <p><strong>Payment Method:</strong> {booking?.paymentMethod}</p>
//               <p><strong>Coupon:</strong> {booking?.couponCode || "None"}</p>
//               <p><strong>Wallet Used:</strong> ₹{booking?.walletUsed || 0}</p>
//             </div>
//           </div>

//           {/* Travelers */}
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-3 text-lg">Traveler Info</h4>
//             <ul className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
//               {booking?.travelers?.map((t, idx) => (
//                 <li key={idx}>• {t?.fullName}, Age {t?.age}, {t?.gender}</li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-3 text-lg">Contact Info</h4>
//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//               <p>{booking?.contactDetails?.name}, {booking?.contactDetails?.phone}</p>
//               <p>{booking?.contactDetails?.email}</p>
//             </div>
//           </div>

//           {/* Cancel Booking */}
//           {booking?.bookingStatus !== "cancelled" && new Date(booking?.travelDate!) > new Date() && (
//             <>
//               <Separator className="my-4" />
//               <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="destructive" className="w-full sm:w-auto">
//                     Cancel Booking
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <h3 className="font-semibold text-lg mb-2">Reason for Cancellation</h3>
//                   <Textarea
//                     rows={4}
//                     value={cancelReason}
//                     onChange={(e) => setCancelReason(e.target.value)}
//                     placeholder="Write your reason here..."
//                   />
//                   <Button onClick={handleCancel} className="mt-4 w-full">
//                     Submit Cancellation
//                   </Button>
//                 </DialogContent>
//               </Dialog>
//             </>
//           )}
//            {/* Main Content */}
//           <div className="lg:col-span-2 space-y-12">
//             {/* Overview */}
//             <section className="bg-white rounded-xl p-8 shadow-sm border">
//               <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>
//               <p className="text-muted-foreground text-lg leading-relaxed">{pkg?.description}</p>
//             </section>



//             {/* Itinerary */}
//             <section className="bg-white rounded-xl p-8 shadow-sm border">
//               <h2 className="text-2xl font-bold text-foreground mb-6">Day by Day Itinerary</h2>
//               <div className="space-y-4">
//                 {pkg?.itinerary?.map((day, index) => (
//                   <Card
//                     key={index}
//                     className="border-l-4 border-l-orange hover:shadow-md transition-shadow"
//                   >
//                     <CardContent className="p-6">
//                       <div className="flex items-start space-x-4">
//                         <div className="bg-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
//                           {day.day}
//                         </div>
//                         <div className="flex-1">
//                           <h3 className="text-xl font-semibold text-foreground mb-3">
//                             {day.title}
//                           </h3>
//                           <ul className="text-muted-foreground space-y-2">
//                             {day.activities.map((activity, actIndex) => (
//                               <li key={actIndex} className="flex items-center">
//                                 <div className="w-2 h-2 bg-orange rounded-full mr-3 flex-shrink-0"></div>
//                                 {activity}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </section>

//             {/* What's Included */}
//             <section className="bg-white rounded-xl p-8 shadow-sm border">
//               <h2 className="text-2xl font-bold text-foreground mb-6">
//                 What's Included & Not Included
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-green-600 flex items-center">
//                     <Check className="w-5 h-5 mr-2" />
//                     Included
//                   </h3>
//                   <ul className="space-y-3">
//                     {pkg?.included?.map((item, index) => (
//                       <li key={index} className="flex items-start space-x-3">
//                         <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//                         <span className="text-muted-foreground">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-red-600 flex items-center">
//                     <span className="w-5 h-5 mr-2 text-red-600">×</span>
//                     Not Included
//                   </h3>
//                   <ul className="space-y-3">
//                     {pkg?.notIncluded?.map((item, index) => (
//                       <li key={index} className="flex items-start space-x-3">
//                         <span className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0">×</span>
//                         <span className="text-muted-foreground">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* Retry Payment */}
//           {(booking?.paymentStatus === "pending" || booking?.paymentStatus === "failed") && (
//             <button
//               onClick={() => setShowRetryModal(true)}
//               className="text-blue-600 underline font-medium"
//             >
//               Retry Payment
//             </button>
//           )}

//           <RetryPaymentModal
//             open={showRetryModal}
//             onClose={() => setShowRetryModal(false)}
//             bookingId={booking?._id || ""}
//             prefill={{
//               name: booking?.contactDetails?.name || "",
//               email: booking?.contactDetails?.email || "",
//               contact: booking?.contactDetails?.phone || "",
//             }}
//             onRetrySuccess={(updated) => setBooking(updated)}
//           />

//           {booking?.bookingStatus !== "cancelled" &&
//             new Date(booking?.travelDate!) <= new Date() && (
//               <p className="text-sm text-gray-500 mt-4 italic">
//                 Booking cannot be cancelled after the travel date.
//               </p>
//             )}
//         </CardContent>
//       </Card>
//       {booking?.bookingStatus == "confirmed" &&
//         <Button
//           className="px-6 py-3 text-base bg"
//           onClick={handleAddReview}
//         >
//           Write a Review
//         </Button>
//       }


//     </div>
//   );
// }
// export default BookingDetailPage


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
 import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { getBookingById, cancelBooking, downloadInvoice } from '@/services/user/bookingService';
import { fetchPackgeById } from '@/services/user/PackageService';
import type { IPackage } from '@/types/IPackage';
import type { IBooking } from '@/types/IBooking';
import { RetryPaymentModal } from './RetryPaymentModal';
import { 
  DownloadIcon, 
  Check, 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [pkg, setPkg] = useState<IPackage | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await getBookingById(id!);
        setBooking(data.booking);
        console.log(data, 'data')
      } catch {
        toast.error('Failed to load booking.');
        navigate('/account/bookings');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadBooking();
  }, [id,]);

  const pkgId=booking?.packageId._id
  useEffect(() => {
    const loadPackage = async () => {
      if (!pkgId) {
        return;
      }
      try {
        const data = await fetchPackgeById(pkgId);
        console.log(data,'pkg data')
        setPkg(data);
      } catch (error) {
        console.error('Failed to fetch package details', error);
      }
    };
    loadPackage();
  }, [pkgId]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason.');
      return;
    }

    try {
      await cancelBooking(id!, cancelReason);
      console.log(cancelReason, 'reason');
      toast.success('Booking cancelled.');

      setBooking((prev) =>
        prev
          ? {
            ...prev,
            bookingStatus: 'cancelled',
            updatedAt: new Date(),
          }
          : prev
      );
      setOpen(false);
    } catch {
      toast.error('Cancellation failed.');
    }
  };

  const handleDownloadInvoice = async () => {
    setLoading(true)
    try {
      const response = await downloadInvoice(booking?._id!)
    } catch (error) {
      console.error("Error downloading invoice", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setLoading(false)
    }
  };

  const packageId = booking?.packageId._id
  const handleAddReview = () => {
    navigate(`/packages/${packageId}/review/add`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {booking?.packageId?.title}
                </h1>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking?.bookingStatus || '')}`}>
                  {getStatusIcon(booking?.bookingStatus || '')}
                  {booking?.bookingStatus?.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Booking: {booking?.bookingCode}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Package: {booking?.packageId.packageCode}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2"
              >
                <DownloadIcon className="w-4 h-4" />
                {loading ? "Downloading..." : "Download Invoice"}
              </Button>
              
              {booking?.bookingStatus == "confirmed" && (
                <Button
                  onClick={handleAddReview}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Star className="w-4 h-4" />
                  Write Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Image */}
            {booking?.packageId?.imageUrls?.[0]?.url && (
              <Card className="overflow-hidden">
                <img
                  src={booking?.packageId.imageUrls[0].url.replace("/upload/", "/upload/f_auto,q_auto/")}
                  alt={booking?.packageId.title}
                  className="w-full h-64 lg:h-80 object-cover"
                />
              </Card>
            )}

            {/* Trip Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Trip Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{pkg?.description}</p>
              </CardContent>
            </Card>

            {/* Day by Day Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Day by Day Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pkg?.itinerary?.map((day, index) => (
                    <div key={index} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {day.day}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {day.title}
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  What's Included & Not Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2 mb-4">
                      <Check className="w-5 h-5" />
                      Included
                    </h3>
                    <ul className="space-y-3">
                      {pkg?.included?.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5" />
                      Not Included
                    </h3>
                    <ul className="space-y-3">
                      {pkg?.notIncluded?.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Travel Date</span>
                  <span className="font-medium">
                    {booking?.travelDate
                      ? new Date(booking?.travelDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "—"}
                  </span>
                </div>

                 <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-xl text-green-600">₹{booking?.totalAmount}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Amount Paid</span>
                  <span className="font-semibold text-xl text-green-600">₹{booking?.amountPaid}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    booking?.paymentStatus === 'paid' ? 'text-green-600' :
                    booking?.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {booking?.paymentStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {booking?.paymentMethod}
                  </span>
                </div>
 {booking?.walletUsed && booking?.walletAmountUsed! > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Wallet Used</span>
                    <span className="font-medium text-green-600">₹{booking?.walletAmountUsed}</span>
                  </div>
                )}
                {booking?.couponCode && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Coupon Applied</span>
                    <span className="font-medium text-green-600">{booking?.couponCode}</span>
                  </div>
                )}

               
              </CardContent>
            </Card>

            {/* Traveler Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Travelers ({booking?.travelers?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {booking?.travelers?.map((traveler, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{traveler?.fullName}</div>
                      <div className="text-sm text-gray-600">
                        Age {traveler?.age} • {traveler?.gender}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{booking?.contactDetails?.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-700">{booking?.contactDetails?.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-gray-700">{booking?.contactDetails?.email}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Payment */}
              {(booking?.paymentStatus === "pending" || booking?.paymentStatus === "failed") && (
                <Button
                  onClick={() => setShowRetryModal(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Retry Payment
                </Button>
              )}

              {/* Cancel Booking */}
              {booking?.bookingStatus !== "cancelled" && new Date(booking?.travelDate!) > new Date() && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Cancel Booking
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Cancel Booking</h3>
                      <p className="text-gray-600">Please provide a reason for cancellation:</p>
                      <Textarea
                        rows={4}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Enter your reason for cancellation..."
                        className="w-full"
                      />
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                          Keep Booking
                        </Button>
                        <Button onClick={handleCancel} variant="destructive" className="flex-1">
                          Cancel Booking
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {booking?.bookingStatus !== "cancelled" &&
                new Date(booking?.travelDate!) <= new Date() && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        This booking cannot be cancelled as the travel date has passed.
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Retry Payment Modal */}
      <RetryPaymentModal
        open={showRetryModal}
        onClose={() => setShowRetryModal(false)}
        bookingId={booking?._id || ""}
        prefill={{
          name: booking?.contactDetails?.name || "",
          email: booking?.contactDetails?.email || "",
          contact: booking?.contactDetails?.phone || "",
        }}
        onRetrySuccess={(updated) => setBooking(updated)}
      />
    </div>
  );
};

export default BookingDetailPage;