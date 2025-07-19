
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/Card";
import { Separator } from "@/features/components/ui/separator";
import { Button } from "@/features/components/Button";
import { Textarea } from "@//components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent } from "@/features/components/ui/Dialog";
import { getBookingById, cancelBooking } from "@/features/services/user/bookingService";
import type { IBooking } from "@/features/types/IBooking";
import { BookingSchema, type BookingFormSchema } from "@/features/schemas/BookingSchema";
import { RetryPaymentModal } from "./RetryPaymentModal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showRetryModal, setShowRetryModal] = useState(false);


  useEffect(() => {


    const loadBooking = async () => {
      try {
        const data = await getBookingById(id!);
        setBooking(data.booking);
      } catch {
        toast.error("Failed to load booking.");
        navigate("/account/bookings");
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
      console.log(cancelReason, 'reason')
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

          {/* Booking Summary */}
          <div className="grid grid-cols-2 gap-4">
                        <p><strong>Package:</strong> {booking.bookingCode}</p>
            <p><strong>Package:</strong> {booking.packageId?.title}</p>
            {booking?.travelDate ? (
              <p>
                <strong>Travel Date:</strong>{" "}
                {new Date(booking?.travelDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            ) : (
              <p>
                <strong>Travel Date:</strong> —
              </p>
            )}            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-medium ${booking.bookingStatus === "cancelled" ? "text-red-500" : "text-green-600"
                  }`}
              >
                {booking.bookingStatus}
              </span>
            </p>
            <p><strong>Payment:</strong> ₹{booking.amountPaid} ({booking.paymentStatus})</p>
            <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
            <p><strong>Coupon:</strong> {booking.couponCode || "None"}</p>
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

          {booking.bookingStatus !== "cancelled" && new Date(booking?.travelDate!) > new Date() && (
            <>
              <Separator className="my-4" />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
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
          {(booking?.paymentStatus === "pending" || booking?.paymentStatus === "failed") && (
            <button onClick={() => setShowRetryModal(true)} className="text-blue-600 underline">
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


          {booking.bookingStatus !== "cancelled" && new Date(booking?.travelDate!) <= new Date() && (
            <p className="text-sm text-muted-foreground mt-4 italic">
              Booking cannot be cancelled after the travel date.
            </p>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDetailPage;
