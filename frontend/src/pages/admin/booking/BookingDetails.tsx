import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { getBookingById, cancelBooking, confirmBooking } from '@/services/admin/bookingService';
import { getPackageById } from '@/services/admin/packageService';
import type { IPackage } from '@/types/IPackage';
import type { IBooking } from '@/types/IBooking';
import {
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
} from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState(false)
  const [pkg, setPkg] = useState<IPackage | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await getBookingById(id!);
        setBooking(data.booking);
        console.log(data, 'data')
      } catch {
        toast.error('Failed to load booking.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadBooking();
  }, [id,]);

  const pkgId = booking?.packageId._id
  useEffect(() => {
    const loadPackage = async () => {
      if (!pkgId) {
        return;
      }
      try {
        const data = await getPackageById(pkgId);
        console.log(data, 'pkg data')
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
  const handleConfirm = async () => {
    if (!note.trim()) {
      toast.error('Please provide a cancellation reason.');
      return;
    }

    try {
      await confirmBooking(id!, note);
      toast.success('Booking cancelled.');

      setBooking((prev) =>
        prev
          ? {
            ...prev,
            bookingStatus: 'confirmed',
            updatedAt: new Date(),
          }
          : prev
      );
      setNoteOpen(false);
    } catch {
      toast.error('Confirmation failed.');
    }
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
                  <section className="bg-white rounded-xl p-8 shadow-sm border">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Day by Day Itinerary</h2>
                    <div className="space-y-4">
                      {pkg?.itinerary?.map((day, index) => (
                        <Card
                          key={index}
                          className="border-l-4 border-l-orange hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="bg-orange text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                {day.day}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-foreground mb-1">
                                  {day.title}
                                </h3>
                                {day.description && (
                                  <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                                )}
                                <ul className="space-y-2">
                                  {day.activities
                                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                    .map((activity, actIndex) => {
                                      const formatTime = (time24: string) => {
                                        const [hourStr, minute] = time24.split(":");
                                        let hour = parseInt(hourStr, 10);
                                        const ampm = hour >= 12 ? "PM" : "AM";
                                        hour = hour % 12 || 12;
                                        return `${hour}:${minute} ${ampm}`;
                                      };

                                      return (
                                        <li key={actIndex} className="flex items-center space-x-2">
                                          <span className="text-orange font-semibold">
                                            {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                                          </span>
                                          <span className="text-muted-foreground">{activity.activity}</span>
                                        </li>
                                      );
                                    })}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>

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
                  <span className={`font-medium ${booking?.paymentStatus === 'paid' ? 'text-green-600' :
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
                      <div className="text-sm text-gray-600">
                        {traveler?.idType?.toUpperCase()}: {traveler?.idNumber}
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
              <CardContent className="space-y-5">
                {/* User Account Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Booked By
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {booking?.userId?.username || "N/A"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {booking?.userId?.email || "No email available"}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Checkout Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Contact Details (Provided at Checkout)
                  </h3>

                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        {booking?.contactDetails?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-700">
                        {booking?.contactDetails?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-700">
                        {booking?.contactDetails?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Confirms Buttons */}

              {booking?.bookingStatus !== "cancelled" &&
                booking?.bookingStatus !== "confirmed" && new Date(booking?.travelDate!) > new Date() && (

                  <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Confirm Booking
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Confirm Booking</h3>
                        <p className="text-gray-600">Additional Note:</p>
                        <Textarea
                          rows={4}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Please add additional note..."
                          className="w-full"
                        />
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setNoteOpen(false)} className="flex-1">
                            Close
                          </Button>
                          <Button onClick={handleConfirm} variant="destructive" className="flex-1">
                            Confirm Booking
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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


    </div>
  );
};

export default BookingDetails;