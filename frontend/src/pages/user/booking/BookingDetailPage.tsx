import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import {
  getBookingById,
  cancelBooking,
  downloadInvoice,
  changeTravelDate,
  removeTraveler,
} from '@/services/user/bookingService';
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
  Star,
} from 'lucide-react';
import { ChangeTravelDate } from './ChangeTravelDate';
import PackageDetailPickUp from '../packages/pages/PackageDetailPickUp';
import { BookingHistoryCard } from '@/components/booking/BookingHistoryCard';
 const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [selectedTravelerIndex, setSelectedTravelerIndex] = useState<number | null>(null);
  const [travellerCancelReason, settravellerCancelReason] = useState('');
  const [travellerOpen, setTravellerOpen] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await getBookingById(id!);
        setBooking(data.booking);
        console.log(data, 'data');
      } catch {
        toast.error('Failed to load booking.');
        navigate('/account/bookings');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadBooking();
  }, [id]);

  const pkgId = booking?.packageId._id;
  useEffect(() => {
    const loadPackage = async () => {
      if (!pkgId) {
        return;
      }
      try {
        const data = await fetchPackgeById(pkgId);
        console.log(data, 'pkg data');
        setPkg(data as IPackage);
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
    } catch(error:any) {
      toast.error(error?.response?.data.message||'Cancellation failed.');
      console.log(error?.response.data.message,'bookinug')
    }
  };

  const handleDownloadInvoice = async () => {
    setLoading(true);
    try {
      const response = await downloadInvoice(booking?._id!);
    } catch (error) {
      console.error('Error downloading invoice', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Remove traveler
  const handleRemoveTraveler = async (travelerIndex: number, note?: string) => {
    if (travelerIndex === undefined || travelerIndex < 0) {
      toast.error('Invalid traveler selected.');
      return;
    }

    try {
      const updatedBooking = await removeTraveler(id!, travelerIndex, note);
      toast.success('Traveler removed successfully.');

      setBooking(updatedBooking);
      setTravellerOpen(false);
    } catch (error:any) {
      toast.error(error?.response?.data?.message||'Failed to remove traveler.');
      console.error(error);
    }
  };

  // Change travel date (prepone/postpone)
  const handleChangeTravelDate = async (newDate: string | Date, note?: string) => {
    if (!newDate) {
      toast.error('Please select a new travel date.');
      return;
    }

    try {
      const updatedBooking = await changeTravelDate(id!, newDate, note);
      setBooking(updatedBooking);
      console.log(updatedBooking, 'travel booking date cahge');
      toast.success('Travel date updated successfully.');

      setBooking(updatedBooking);
    } catch (error: any) {
      toast.error(error?.response?.data?.message||'Failed to  traveler Date.');
      console.error(error);
    }
  };

  const packageId = booking?.packageId._id;
  const handleAddReview = () => {
    navigate(`/packages/${packageId}/review/add`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking?.bookingStatus || '')}`}
                >
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
                {loading ? 'Downloading...' : 'Download Invoice'}
              </Button>

              {booking?.bookingStatus == 'confirmed' && (
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
                  src={booking?.packageId.imageUrls[0].url.replace(
                    '/upload/',
                    '/upload/f_auto,q_auto/'
                  )}
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
            <PackageDetailPickUp startPoint={pkg?.startPoint!} />

            {/* Day by Day Itinerary */}
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
                                  const [hourStr, minute] = time24.split(':');
                                  let hour = parseInt(hourStr, 10);
                                  const ampm = hour >= 12 ? 'PM' : 'AM';
                                  hour = hour % 12 || 12;
                                  return `${hour}:${minute} ${ampm}`;
                                };

                                return (
                                  <li key={actIndex} className="flex items-center space-x-2">
                                    <span className="text-orange font-semibold">
                                      {formatTime(activity.startTime)} -{' '}
                                      {formatTime(activity.endTime)}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {activity.activity}
                                    </span>
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
                      ? new Date(booking?.travelDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold text-xl text-green-600">
                    ₹{booking?.totalAmount}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Amount Paid</span>
                  <span className="font-semibold text-xl text-green-600">
                    ₹{booking?.amountPaid}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-medium ${
                      booking?.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : booking?.paymentStatus === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
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
            {booking &&
              booking.bookingStatus !== 'cancelled' &&
              booking.bookingStatus !== 'confirmed' &&
              new Date(booking.travelDate!) > new Date() && (
                <ChangeTravelDate
                  booking={booking}
                  handleChangeTravelDate={handleChangeTravelDate}
                />
              )}

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
                    <div key={index} className="p-3 bg-gray-50 rounded-lg relative">
                      <div className="font-medium text-gray-900">{traveler?.fullName}</div>
                      <div className="text-sm text-gray-600">
                        Age {traveler?.age} • {traveler?.gender}
                      </div>
                      <div className="text-sm text-gray-600">
                        {traveler?.idType?.toUpperCase()}: {traveler?.idNumber}
                      </div>

                      {/* Cancel/Edit buttons only if booking is not confirmed/cancelled */}
                      {booking?.bookingStatus !== 'confirmed' &&
                        booking?.bookingStatus !== 'cancelled' && (
                          <div className="mt-2 flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setTravellerOpen(true);
                                setSelectedTravelerIndex(index);
                              }}
                            >
                              Cancel Traveler
                            </Button>
                            {/* <Button
                variant="outline"
                size="sm"
                onClick={() => editTraveler(index)}
              >
                Edit
              </Button> */}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Traveler cancellation modal */}
              <Dialog open={travellerOpen} onOpenChange={setTravellerOpen}>
                <DialogContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cancel Traveler</h3>
                    <Textarea
                      rows={4}
                      value={travellerCancelReason}
                      onChange={(e) => settravellerCancelReason(e.target.value)}
                      placeholder="Enter cancellation reason..."
                      className="w-full"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setTravellerOpen(false)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() =>
                          handleRemoveTraveler(selectedTravelerIndex!, travellerCancelReason)
                        }
                      >
                        Cancel Traveler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>

            {/* 

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
              {(booking?.paymentStatus === 'pending' || booking?.paymentStatus === 'failed') && (
                <Button
                  onClick={() => setShowRetryModal(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Retry Payment
                </Button>
              )}

              {/* Cancel Booking */}
              {booking?.bookingStatus !== 'cancelled' &&
                new Date(booking?.travelDate!) > new Date() && (
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
                          <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                          >
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

              {booking?.bookingStatus !== 'cancelled' &&
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
      <BookingHistoryCard
        title="Traveler History"
        type="traveler"
        history={booking?.travelerHistory || []}
      />
      <BookingHistoryCard
        title="Travel Date Change History"
        type="date"
        history={booking?.history || []}
      />

      {/* Retry Payment Modal */}
      <RetryPaymentModal
        open={showRetryModal}
        onClose={() => setShowRetryModal(false)}
        bookingId={booking?._id || ''}
        prefill={{
          name: booking?.contactDetails?.name || '',
          email: booking?.contactDetails?.email || '',
          contact: booking?.contactDetails?.phone || '',
        }}
        onRetrySuccess={(updated) => setBooking(updated)}
      />
    </div>
  );
};

export default BookingDetailPage;
