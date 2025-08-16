import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/Button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { getBookingById, cancelBooking, downloadInvoice } from '@/services/user/bookingService';
import type { IBooking } from '@/types/IBooking';
import { RetryPaymentModal } from './RetryPaymentModal';
import { DownloadIcon } from 'lucide-react';
const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showRetryModal, setShowRetryModal] = useState(false);

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


return (
  <div className="p-6 max-w-4xl mx-auto space-y-6">
    <Card className="shadow-md rounded-2xl border border-gray-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">Booking Details</CardTitle>

        {/* Left-aligned action buttons */}
        <div className="flex justify-start sm:justify-end w-full sm:w-auto">
          <button
            disabled={loading}
            onClick={handleDownloadInvoice}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-200 shadow-sm ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            <DownloadIcon size={18} />
            {loading ? "Downloading..." : "Download Invoice"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 text-sm text-gray-700">
        {/* Package Image */}
        {booking?.packageId?.imageUrls?.[0]?.url && (
          <img
            src={booking?.packageId.imageUrls[0].url.replace("/upload/", "/upload/f_auto,q_auto/")}
            alt={booking?.packageId.title}
            className="w-full h-56 object-cover rounded-xl border border-gray-200"
          />
        )}

        {/* Booking Summary */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">Booking Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p><strong>Booking Code:</strong> {booking?.bookingCode}</p>
            <p><strong>Package Code:</strong> {booking?.packageId.packageCode}</p>
            <p><strong>Package:</strong> {booking?.packageId?.title}</p>
            <p>
              <strong>Travel Date:</strong>{" "}
              {booking?.travelDate
                ? new Date(booking?.travelDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${
                  booking?.bookingStatus === "cancelled" ? "text-red-500" : "text-green-600"
                }`}
              >
                {booking?.bookingStatus}
              </span>
            </p>
            <p><strong>Payment:</strong> ₹{booking?.amountPaid} ({booking?.paymentStatus})</p>
            <p><strong>Payment Method:</strong> {booking?.paymentMethod}</p>
            <p><strong>Coupon:</strong> {booking?.couponCode || "None"}</p>
            <p><strong>Wallet Used:</strong> ₹{booking?.walletUsed || 0}</p>
          </div>
        </div>

        {/* Travelers */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">Traveler Info</h4>
          <ul className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {booking?.travelers?.map((t, idx) => (
              <li key={idx}>• {t?.fullName}, Age {t?.age}, {t?.gender}</li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 text-lg">Contact Info</h4>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p>{booking?.contactDetails?.name}, {booking?.contactDetails?.phone}</p>
            <p>{booking?.contactDetails?.email}</p>
          </div>
        </div>

        {/* Cancel Booking */}
        {booking?.bookingStatus !== "cancelled" && new Date(booking?.travelDate!) > new Date() && (
          <>
            <Separator className="my-4" />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Cancel Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <h3 className="font-semibold text-lg mb-2">Reason for Cancellation</h3>
                <Textarea
                  rows={4}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Write your reason here..."
                />
                <Button onClick={handleCancel} className="mt-4 w-full">
                  Submit Cancellation
                </Button>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Retry Payment */}
        {(booking?.paymentStatus === "pending" || booking?.paymentStatus === "failed") && (
          <button
            onClick={() => setShowRetryModal(true)}
            className="text-blue-600 underline font-medium"
          >
            Retry Payment
          </button>
        )}

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

        {booking?.bookingStatus !== "cancelled" &&
          new Date(booking?.travelDate!) <= new Date() && (
            <p className="text-sm text-gray-500 mt-4 italic">
              Booking cannot be cancelled after the travel date.
            </p>
          )}
      </CardContent>
    </Card>
  </div>
);
}
export default BookingDetailPage