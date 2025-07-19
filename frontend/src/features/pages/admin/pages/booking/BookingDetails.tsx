
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
import { Separator } from "@/features/components/ui/separator";
import { Button } from "@/features/components/Button";
import { Textarea } from "@//components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent } from "@/features/components/ui/Dialog";
import { getBookingById, cancelBooking } from "@/features/services/admin/bookingService";
import type { IBooking } from "@/features/types/IBooking";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await getBookingById(id!);
        setBooking(data.booking);
      } catch {
        toast.error("Failed to load booking.");
        navigate("/admin/bookings");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadBooking();
  }, [id]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    try {
      await cancelBooking(id!, cancelReason);
      console.log(cancelReason,'reason')
      toast.success("Booking cancelled.");

      setBooking((prev) =>
        prev
          ? {
              ...prev,
              bookingStatus: "cancelled",
              paymentStatus: "failed",
              updatedAt: new Date() 
            }
          : prev
      );
      setOpen(false);
    } catch {
      toast.error("Cancellation failed.");
    }
  };

  if (loading || !booking) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {/* Image */}
          {booking.packageId?.imageUrls?.[0]?.url && (
            <img
              src={booking.packageId.imageUrls[0].url.replace("/upload/", "/upload/f_auto,q_auto/")}
              alt={booking.packageId.title}
              className="w-full h-56 object-cover rounded-md"
            />
          )}

         <p><strong>email:</strong> {booking.userId?.email}</p>
         <p><strong>username:</strong> {booking.userId?.username}</p>


          {/* Booking Summary */}
          <div className="grid grid-cols-2 gap-4">
              <p><strong>Package:</strong> {booking.bookingCode}</p>

            <p><strong>Package:</strong> {booking.packageId?.title}</p>
            {/* <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p> */}
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${
                  booking.bookingStatus === "cancelled" ? "text-red-500" : "text-green-600"
                }`}
              >
                {booking.bookingStatus}
              </span>
            </p>
            <p><strong>Payment:</strong> ₹{booking.amountPaid} ({booking.paymentStatus})</p>
            <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
            <p><strong>Coupon code:</strong> {booking.couponCode || "None"}</p>
            <p><strong>Wallet Used:</strong> ₹{booking.walletUsed || 0}</p>
          </div>

          <Separator />

          {/* Travelers */}
          <div>
            <h4 className="font-semibold mb-2">Traveler Info</h4>
            <ul className="space-y-1">
              {booking.travelers?.map((t, idx) => (
                <li key={idx}>• {t?.fullName}, Age {t?.age}, {t?.gender}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mt-4 mb-1">Contact Info</h4>
            <p>{booking.contactDetails?.name}, {booking.contactDetails?.phone}</p>
            <p>{booking.contactDetails?.email}</p>
          </div>

          {/* Cancel Button */}
          {booking.bookingStatus !== "cancelled" && (
            <>
              <Separator className="my-4" />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">Cancel Booking</Button>
                </DialogTrigger>
                <DialogContent>
                  <h3 className="font-semibold text-lg mb-2">Reason for Cancellation</h3>
                  <Textarea
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Write your reason here..."
                  />
                  <Button onClick={handleCancel} className="mt-4 w-full">Submit Cancellation</Button>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDetail;

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { ArrowLeft, Calendar, CreditCard, Users, Phone, Mail, MapPin, AlertTriangle, User, Wallet, Tag } from "lucide-react";

//  import { Card,CardContent,CardHeader,CardTitle } from "@/features/components/ui/Card";
// import { Separator } from "@/features/components/ui/separator";
// import { Button } from "@//components/ui/button";
// import { Textarea } from "@//components/ui/textarea";
//  import { Dialog, DialogTrigger, DialogContent } from "@/features/components/ui/Dialog";
//  import { getBookingById,cancelBooking } from "@/features/services/admin/bookingService";
// import { Badge } from "@/features/components/ui/Badge";
// //  import { Avatar, AvatarFallback } from "@//components/ui/avatar";
//  import { type IBooking } from "@/features/types/IBooking";
// // Mock services and types - replace with your actual imports
// // const getBookingById = async (id: string) => {
// //   // Mock data for demonstration
// // //   return {
// // //     booking: {
// // //       _id: id,
// // //       userId: {
// // //         email: "john.doe@example.com",
// // //         username: "johndoe"
// // //       },
// // //       packageId: {
// // //         title: "Exotic Bali Adventure Package",
// // //         imageUrls: [{
// // //           url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop"
// // //         }]
// // //       },
// // //       travelDate: new Date().toISOString(),
// // //       bookingStatus: "confirmed",
// // //       paymentStatus: "completed",
// // //       amountPaid: 25000,
// // //       paymentMethod: "Credit Card",
// // //       couponCode: "SUMMER20",
// // //       walletUsed: 2500,
// // //       travelers: [
// // //         { fullName: "John Doe", age: 28, gender: "Male" },
// // //         { fullName: "Jane Doe", age: 26, gender: "Female" }
// // //       ],
// // //       contactDetails: {
// // //         name: "John Doe",
// // //         phone: "+91 9876543210",
// // //         email: "john.doe@example.com"
// // //       },
// // //       updatedAt: new Date().toISOString()
// // //     }
// // //   };
// // // };

// // const cancelBooking = async (id: string, reason: string) => {
// //   console.log(`Cancelling booking ${id} with reason: ${reason}`);
// //   return Promise.resolve();
// // };
// const BookingDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState<IBooking | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");

//   useEffect(() => {
//     const loadBooking = async () => {
//       try {
//         const data = await getBookingById(id!);
//         setBooking(data.booking);
//       } catch {
//         toast.error("Failed to load booking.");
//         navigate("/admin/bookings");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) loadBooking();
//   }, [id, navigate]);

//   const handleCancel = async () => {
//     if (!cancelReason.trim()) {
//       toast.error("Please provide a cancellation reason.");
//       return;
//     }

//     try {
//       await cancelBooking(id!, cancelReason);
//       console.log(cancelReason, 'reason');
//       toast.success("Booking cancelled successfully.");

//       setBooking((prev) =>
//         prev
//           ? {
//               ...prev,
//               bookingStatus: "cancelled",
//               paymentStatus: "failed",
//               updatedAt: new Date() 
//             }
//           : prev
//       );
//       setOpen(false);
//       setCancelReason("");
//     } catch {
//       toast.error("Cancellation failed.");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "confirmed":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "completed":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "failed":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="text-gray-600 text-lg">Loading booking details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
//           <p className="text-gray-600 text-lg">Booking not found</p>
//           <Button onClick={() => navigate("/admin/bookings")} variant="outline">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Bookings
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center space-x-4">
//             <Button 
//               onClick={() => navigate("/admin/bookings")} 
//               variant="outline" 
//               size="sm"
//               className="hover:bg-white hover:shadow-md transition-all duration-200"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
//               <p className="text-gray-600">ID: {booking._id}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Badge className={`px-3 py-1 ${getStatusColor(booking.bookingStatus)}`}>
//               {booking.bookingStatus.toUpperCase()}
//             </Badge>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Package Details */}
//             <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <div className="relative">
//                 {booking.packageId?.imageUrls?.[0]?.url && (
//                   <div className="relative h-64 overflow-hidden">
//                     <img
//                       src={booking.packageId.imageUrls[0].url.replace("/upload/", "/upload/f_auto,q_auto/")}
//                       alt={booking.packageId.title}
//                       className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
//                     <div className="absolute bottom-4 left-4 text-white">
//                       <h2 className="text-2xl font-bold mb-1">{booking.packageId.title}</h2>
//                       <div className="flex items-center text-sm opacity-90">
//                         <MapPin className="w-4 h-4 mr-1" />
//                         Destination Package
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </Card>

//             {/* Customer Information */}
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//                 <CardTitle className="flex items-center">
//                   <User className="w-5 h-5 mr-2" />
//                   Customer Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="flex items-center space-x-4 mb-4">
//                   {/* <Avatar className="w-12 h-12">
//                     <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold"> */}
//                       {booking.userId.username.charAt(0).toUpperCase()}
//                     {/* </AvatarFallback>
//                   </Avatar> */}
//                   <div>
//                     <h3 className="font-semibold text-lg">{booking.userId.username}</h3>
//                     <p className="text-gray-600 flex items-center">
//                       <Mail className="w-4 h-4 mr-1" />
//                       {booking.userId.email}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Travelers Information */}
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
//                 <CardTitle className="flex items-center">
//                   <Users className="w-5 h-5 mr-2" />
//                   Travelers ({booking.travelers?.length || 0})
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {booking.travelers?.map((traveler, idx) => (
//                     <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
//                       <div className="flex items-center space-x-3">
//                         {/* <Avatar className="w-10 h-10">
//                           <AvatarFallback className="bg-green-100 text-green-600 font-semibold"> */}
//                             {traveler.fullName.split(' ').map(n => n[0]).join('')}
//                           {/* </AvatarFallback>
//                         </Avatar> */}
//                         <div>
//                           <h4 className="font-medium text-gray-900">{traveler.fullName}</h4>
//                           <p className="text-sm text-gray-600">Age {traveler.age} • {traveler.gender}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Contact Information */}
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
//                 <CardTitle className="flex items-center">
//                   <Phone className="w-5 h-5 mr-2" />
//                   Contact Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <User className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{booking.contactDetails.name}</p>
//                       <p className="text-sm text-gray-600">Contact Person</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <Phone className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{booking.contactDetails.phone}</p>
//                       <p className="text-sm text-gray-600">Phone Number</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                       <Mail className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{booking.contactDetails.email}</p>
//                       <p className="text-sm text-gray-600">Email Address</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Booking Summary */}
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//                 <CardTitle className="flex items-center">
//                   <Calendar className="w-5 h-5 mr-2" />
//                   Booking Summary
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6 space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Status</span>
//                     <Badge className={`${getStatusColor(booking.bookingStatus)}`}>
//                       {booking.bookingStatus}
//                     </Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Payment Status</span>
//                     <Badge className={`${getPaymentStatusColor(booking.paymentStatus)}`}>
//                       {booking.paymentStatus}
//                     </Badge>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Travel Date</span>
//                     <span className="font-medium">
//                       {/* {new Date(booking?.travelDate).toLocaleDateString('en-US', {
//                         weekday: 'short',
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })} */}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Last Updated</span>
//                     <span className="font-medium text-sm">
//                       {new Date(booking.updatedAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment Details */}
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//               <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
//                 <CardTitle className="flex items-center">
//                   <CreditCard className="w-5 h-5 mr-2" />
//                   Payment Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="space-y-4">
//                   <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                     <div className="text-center">
//                       <p className="text-sm text-green-600 mb-1">Total Amount Paid</p>
//                       <p className="text-3xl font-bold text-green-700">₹{booking.amountPaid.toLocaleString()}</p>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-600 flex items-center">
//                         <CreditCard className="w-4 h-4 mr-2" />
//                         Payment Method
//                       </span>
//                       <span className="font-medium">{booking.paymentMethod}</span>
//                     </div>
                    
//                     {booking.couponCode && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600 flex items-center">
//                           <Tag className="w-4 h-4 mr-2" />
//                           Coupon Used
//                         </span>
//                         <Badge variant="secondary">{booking.couponCode}</Badge>
//                       </div>
//                     )}
                    
//                     {booking.walletUsed && booking.walletUsed > 0 && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-gray-600 flex items-center">
//                           <Wallet className="w-4 h-4 mr-2" />
//                           Wallet Used
//                         </span>
//                         <span className="font-medium text-blue-600">₹{booking.walletUsed}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Action Buttons */}
//             {booking.bookingStatus !== "cancelled" && (
//               <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//                 <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
//                   <CardTitle className="flex items-center">
//                     <AlertTriangle className="w-5 h-5 mr-2" />
//                     Actions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                    <Dialog open={open} onOpenChange={setOpen}>
//                  <DialogTrigger asChild>
//                    <Button variant="destructive" className="w-full">Cancel Booking</Button>
//                  </DialogTrigger>
//                  <DialogContent>
//                   <h3 className="font-semibold text-lg mb-2">Reason for Cancellation</h3>
//                    <Textarea
//                     rows={4}
//                     value={cancelReason}
//                     onChange={(e) => setCancelReason(e.target.value)}
//                     placeholder="Write your reason here..."
//                   />
//                   <Button onClick={handleCancel} className="mt-4 w-full">Submit Cancellation</Button>
//                 </DialogContent>
//               </Dialog>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingDetail;
